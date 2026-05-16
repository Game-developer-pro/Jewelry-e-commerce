import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | AURELIA` : 'AURELIA | Fine Jewelry'}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: '',
  description: 'Handcrafted fine jewelry for every day. Shop rings, earrings, bracelets, and necklaces.',
  keywords: 'jewelry, gold, silver, rings, earrings, bracelets, necklaces, luxury',
};

export default Meta;
