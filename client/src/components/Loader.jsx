import React from 'react';
import { DotSpinner } from '@uiball/loaders'
export const Loader = () => (
  <div role="status">
    <DotSpinner
      size={50}
      speed={0.9}
      color="black"
    />
  </div>
);
