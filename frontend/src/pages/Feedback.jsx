// src/pages/Feedback.jsx
import Footer from '../components/layout/Footer';
import FeedbackForm from '../components/layout/FeedbackForm';
import Reviews from '../components/layout/Reviews';
const Feedback = () => {
    return (
        <div>
        <FeedbackForm />
        <Reviews />
          <Footer />
        </div>
      );
  };
  
  export default Feedback;