const Photo = ({ style, photoUrl }) => (
  <div style={style} className="photo">
    <img src={photoUrl} alt="Floating" />
  </div>
);

export default Photo;
