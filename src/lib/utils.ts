import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import SHA1 from  'crypto-js/sha1'
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour générer la signature (attention : pas sécurisé en frontend)
export const generateSignature = (timestamp: number, uploadPreset: string, apiSecret: string,options: object|null = null) => {

  let queryString = '';
  if(options){
     queryString = objectToQueryString(options)+'&';
  }
  const signatureString = `${queryString}timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
  return sha1(signatureString); // Utilisez sha1 ou une autre méthode de hachage
};

function objectToQueryString(obj) {
  const params = Object.keys(obj).map(key => `${key}=${obj[key]}`);
  return params.join('&');
}
// Fonction pour hacher la signature avec sha1 (utilisez une bibliothèque comme 'crypto-js')
const sha1 = (input: string): string => {
  return SHA1(input).toString();
};

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cld = new Cloudinary({ cloud: { cloudName: cloudName } });
export const getCloudinaryImage = (public_id: string) => {
  return null
  return cld
      .image(public_id)
      .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
      .quality('auto')
      .resize(auto().gravity(autoGravity()).width(500).height(500))
}

export function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}