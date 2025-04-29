import axios from 'axios';

window.axios = axios;

//IMPORTANT** pour les requ  tes JSON :  
// - envoie toujours les cookies  
// - r  cup  re automatiquement le XSRF-cookie et le met dans le header X-XSRF-TOKEN
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;
