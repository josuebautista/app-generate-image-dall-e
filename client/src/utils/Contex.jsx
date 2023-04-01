import React, { useState } from "react";
import { getRandomPrompt } from ".";
import { useNavigate } from "react-router-dom";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  //Global variables
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Home Variables
  const [allPost, setAllPost] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  // Home Functions
  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://dall-e-backend-9h54.onrender.com/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAllPost(result.data.reverse());
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPost.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchResults(searchResult);
      }, 500),
    );
    console.log(searchText);
  }

  // CreatePost Variables
  const [form, setForm] = useState(
    {
      name: '',
      prompt: '',
      photo: '',
    });
  const [generatingImg, setGeneratingImg] = useState(false);

  // CreatePost Functions
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://dall-e-backend-9h54.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        })
        await response.json();
        navigate('/');
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a prompt and generate an image')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSurpriceMe = (e) => {
    const randomPrompt = getRandomPrompt();
    setForm({ ...form, prompt: randomPrompt })
  }

  // API SERVER REQUEST
  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('https://dall-e-backend-9h54.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt }),
        })
        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please enter a prompt')
    }
  }


  return <AppContext.Provider value={{
    loading,
    setLoading,
    allPost,
    setAllPost,
    searchText,
    setSearchText,
    form,
    setForm,
    generatingImg,
    setGeneratingImg,
    handleSubmit,
    handleChange,
    handleSurpriceMe,
    generateImage,
    fetchPost,
    searchResults,
    setSearchResults,
    searchTimeout,
    setSearchTimeout,
    handleSearchChange,
  }}>
    {children}
  </AppContext.Provider>
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
}

export { AppContext, AppProvider };