// import { Link } from 'react-router-dom';
// import '../styles/Footer.css';

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="particle-background">
//         {[...Array(10)].map((_, i) => (
//           <div key={i} className={`particle particle-${i}`} />
//         ))}
//       </div>
//       <div className="footer-content">
//         <p className="footer-text">
//           &copy; {new Date().getFullYear()} Alawaf HRMS. All rights reserved.
//         </p>
//         <Link to="/" className="footer-link">
//           Back to Home
//         </Link>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Alawaf HRMS. All rights reserved.
        </p>
        {/* <Link to="/" className="footer-link">
          Back to Home
        </Link> */}
      </div>
    </footer>
  );
};

export default Footer;