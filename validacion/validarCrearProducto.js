export default function validarCrearCuenta(valores) {
  let errores = {};

  // Validar el nombre del usuario 
  if(!valores.nombre){
    errores.nombre = 'El Nombre es obligatorio'
  }

  // Validar la empresa 
  if(!valores.empresa) {
    errores.empresa = "El nombre de la empresa es obligatorio"
  }

  // Validar la url
  if(!valores.url) {
    errores.url = "La URL del producto es obligatoria"
  } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
    errores.url = "La URL no es válida"
  }

  // Validar la descripcion
  if(!valores.descripcion){
    errores.descripcion = 'Agrega una descripcion de tu producto'
  }

  return errores;
}