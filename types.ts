export interface KTPData {
  provinsi: string;
  kabupaten: string;
  nik: string;
  nama: string;
  tempatLahir: string;
  tglLahir: string;
  jenisKelamin: 'LAKI-LAKI' | 'PEREMPUAN';
  golDarah: string;
  alamat: string;
  rt: string;
  rw: string;
  kelDesa: string;
  kecamatan: string;
  agama: string;
  statusPerkawinan: string;
  pekerjaan: string;
  kewarganegaraan: string;
  berlakuHingga: string;
  photoUrl: string | null;
  signatureUrl: string | null;
  signatureCityDate: string; // The text under the photo
}

export interface CardTransform {
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

export const initialKTPData: KTPData = {
  provinsi: 'KALIMANTAN BARAT',
  kabupaten: 'LANDAK',
  nik: '6108010110930003',
  nama: 'MUHAMMAD AQMAL NURCAHYO',
  tempatLahir: 'PONTIANAK',
  tglLahir: '01-10-1993',
  jenisKelamin: 'LAKI-LAKI',
  golDarah: 'O',
  alamat: 'GG. PEMUDA',
  rt: '001',
  rw: '001',
  kelDesa: 'HILIR KANTOR',
  kecamatan: 'NGABANG',
  agama: 'ISLAM',
  statusPerkawinan: 'BELUM KAWIN',
  pekerjaan: 'PELAJAR/MAHASISWA',
  kewarganegaraan: 'WNI',
  berlakuHingga: 'SEUMUR HIDUP',
  photoUrl: null,
  signatureUrl: null,
  signatureCityDate: 'LANDAK\n18-10-2012'
};