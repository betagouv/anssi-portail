export const decodeEntitesHtml = (chaine:string) =>{
  return chaine.replaceAll("&#039;", "'")
}