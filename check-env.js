// check-env.js
require('dotenv').config();

console.log('=== DIAGNÓSTICO VARIABLES DE ENTORNO ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ EXISTE' : '❌ NO EXISTE');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ EXISTE' : '❌ NO EXISTE');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || '❌ NO EXISTE');

console.log('\n=== DETALLES ===');
console.log('GOOGLE_CLIENT_ID longitud:', process.env.GOOGLE_CLIENT_ID?.length);
console.log('GOOGLE_CLIENT_SECRET longitud:', process.env.GOOGLE_CLIENT_SECRET?.length);
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);

console.log('\n=== PRIMEROS Y ÚLTIMOS CARACTERES ===');
if (process.env.GOOGLE_CLIENT_ID) {
    console.log('Client ID empieza con:', process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...');
    console.log('Client ID termina con:', '...' + process.env.GOOGLE_CLIENT_ID.slice(-10));
}

if (process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Client Secret empieza con:', process.env.GOOGLE_CLIENT_SECRET.substring(0, 5) + '...');
}