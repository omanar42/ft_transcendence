
interface ProfileAvatar{
    className:string,
    src:string,
    onClick:string
}

function ProfileAvatar({className, src, onClick}:any){

    return(
      <img
      className={className}
      src={src}
      alt="avatar"
      onClick={onClick}
    />
    )
  }
  
  export default ProfileAvatar;