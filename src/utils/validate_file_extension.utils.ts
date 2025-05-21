export default function validateFileExtension(ext: string){
    const availableFileExtensions = [".js", ".ts"];
    return availableFileExtensions.includes(ext);
}