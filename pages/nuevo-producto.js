import React, {useState, useContext, Fragment} from 'react';
import {css} from '@emotion/react';
import Router, {useRouter} from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import {FirebaseContext} from '../firebase';

import Error404 from '../components/layout/404';

// Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: '',
}


const NuevoProducto = () => {

  // State de las imagenes 
  const [nombreimagen, guardarNombre] = useState('');
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlimagen, guardarUrlImagen] = useState('');

  const [error, setError] = useState(false);

  const {valores, errores, submitForm, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const {nombre, empresa, imagen, url, descripcion} = valores;

  // Hook de router para redireccionar 
  const router = useRouter();

  // context con las operaciones crud de firebase 
  const {usuario, firebase} = useContext(FirebaseContext);

  console.log(usuario);

  async function crearProducto() {
      // si el usuario no está autenticado llevar al login 
      if(!usuario){
        return router.push('/login');
      }
      // Crear el objeto de nuevo producto 
      const producto = {
        nombre, 
        empresa,
        url,
        urlimagen,
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now(),
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName
        }
      }

      // insertarlo en la base de datos 
      firebase.db.collection('productos').add(producto);
      
      // redireccionar 
      return router.push('/');
  }

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  }

  const handleProgress = progreso => guardarProgreso({progreso});

  const handleUploadError = error => {
    guardarSubiendo(error);
    console.log(error);
  };

  const handleUploadSuccess = nombre => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url => {
        console.log(url);
        guardarUrlImagen(url);
      })
  };
  
  return (
    <div>
      <Layout>
        {!usuario ? <Error404/> : (
          <Fragment>
            
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo Producto</h1>
            <Formulario
              onSubmit={handleSubmit}
            >
              <fieldset>
                <legend>Información General</legend>
                <Campo>
                  <label htmlFor='nombre'>Nombre</label>
                  <input
                    type='text'
                    id='nombre'
                    placeholder='Tu Nombre'
                    name='nombre'
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor='empresa'>Empresa</label>
                  <input
                    type='text'
                    id='empresa'
                    placeholder='Nombre de la Empresa'
                    name='empresa'
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor='imagen'>Imagen</label>
                  <FileUploader
                    accept='image/*'
                    id='imagen'
                    name='imagen'
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>

                <Campo>
                  <label htmlFor='url'>Url</label>
                  <input
                    type='url'
                    id='url'
                    placeholder='URL de tu producto'
                    name='url'
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>
              <fieldset>
                <legend>Sobre tu Producto</legend>
                <Campo>
                <label htmlFor='descripcion'>Descripcion</label>
                <textarea
                  id='descripcion'
                  placeholder='Nombre de la Descripcion'
                  name='descripcion'
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              </fieldset>


              {errores.descripcion && <Error>{errores.descripcion}</Error>}

                {error && <Error>{error}</Error>}

                <InputSubmit
                  type='submit'
                  value='Crear Producto'
                />
            </Formulario>
          </Fragment>
        )}
        </Layout>
    </div>
  )
}
export default NuevoProducto;