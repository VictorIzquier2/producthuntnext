import React, { Fragment } from 'react';
import HeaderLayout from './Header';
import {Global, css} from '@emotion/react';
import Head from 'next/head';

const Layout = props => {
  return ( 
    <Fragment>
      <Global
        styles={css`
          :root {
            --gris: #3D3D3D;
            --gris2: #6F6F6F;
            --gris3: #e1e1e1;
            --naranja: #DA552F;
          }

          html {
            font-size: 62.5%; /* 1rem 10px */
            box-sizing: border-box;
          }

          *, *:before, *:after{
            box-sizing: inherit;
          }

          body {
            font-size: 1.6rem; 
            font-family: 'PT Sans', sans-serif;
          }

          h1, h2, h3 {
            margin: 0 0 2rem 0;
            line-height: 1.5;
          }
          
          h1, h2 {
            font-family: 'Roboto Slab', serif;
            font-weight: 700
          }
          h3 {
            font-family: 'PT Sans', sans-serif;
          }

          ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }

          a {
            text-decoration: none;
          }
        `}
      />
      <Head>
        <title>Product Hunt Firebase y Next.js</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet"/>
        <link href='/static/css/app.css' rel='stylesheet'/>
      </Head>
      
      <HeaderLayout/>
      <main>
        {props.children}
      </main>
    </Fragment>
   );
} 
export default Layout;