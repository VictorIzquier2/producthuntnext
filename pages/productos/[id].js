import React, {useEffect, useContext, useState, Fragment} from 'react';
import {useRouter} from 'next/router';

import Layout from '../../components/layout/Layout';
import {FirebaseContext} from '../../firebase';
import Error404 from '../../components/layout/404';
import {css} from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';
import createRouteLoader from 'next/dist/client/route-loader';

const ContenedorProducto = styled.div`
  @media(min-width: 768px){
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const Producto = () => {

  // state del componente 
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);

  // Routing para obtener el id actual
  const router = useRouter();
  const {query: {id}} = router;

  // context de firebase 
  const {firebase, usuario} = useContext(FirebaseContext);

  useEffect(() => {
    if(id){
      const obtenerProducto = async () =>{
        const productoQuery = await firebase.db.collection('productos').doc(id);
        const producto = await productoQuery.get();
        if(producto.exists){
          guardarProducto(producto.data());
        }else{
          guardarError(true);
        }
      }
      obtenerProducto();
    }
  }, [id])
  
  if(Object.keys(producto).length === 0) return 'Cargando...';

  const {comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador} = producto;;


  return ( 
    <Layout>
      <Fragment>
        {error && <Error404/>}
        <div className='contenedor'>
          <h1 css={css`
            text-align: center;
            margin-top: 5rem;
            `}
          >{nombre}</h1>
          <ContenedorProducto>
            <div>
              <p>Publicado hace: {formatDistanceToNow(new Date(creado), {locale: es})}</p>
              <p>Publicado por: {creador.nombre} de: {empresa}</p>
              <img src={urlimagen}/>
              <p>{descripcion}</p>
              {usuario && (
                <Fragment>
                  <h2>Agrega tu comentario</h2>
                  <form>
                    <Campo>
                      <input
                        type='text'
                        name='mensaje'
                      />
                    </Campo>
                    <InputSubmit
                      type='submit'
                      value='Agregar Comentario'
                    />
                  </form>
                </Fragment>
              )}
              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >Comentarios</h2>
              {comentarios.map(comentario =>(
                <li>
                  <p>Escrito por: {comentario.usuarioNombre}</p>
                  <p>{comentario.nombre}</p>
                </li>
              ))}
            </div>
            <aside>
              <Boton
                target='_blank'
                bgColor='true'
                href={url}
              >Visitar URL</Boton>
              <div
                css={css`
                  margin: 5rem;
                `}
              ></div>
              <p>{votos} Votos</p>
              {usuario && (
               <Boton>
                 votar
               </Boton>
              )}
            </aside>
          </ContenedorProducto>
        </div>
      </Fragment>
    </Layout>
   );
}
 
export default Producto;