
export const fileFilterHelper = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
   if ( !file ) return callback( new Error( 'File is empty' ), false );
   const fileExtension = file.mimetype.split('/')[1];
   const validExtension = [ 'jpg', 'jpeg', 'png', 'gift' ];
   if (validExtension.includes( fileExtension ) ) return callback( null, true );
   return callback( null, true );
}