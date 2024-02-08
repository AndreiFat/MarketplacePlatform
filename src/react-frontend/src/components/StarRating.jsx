import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar as solidStar, faStarHalfStroke} from '@fortawesome/free-solid-svg-icons';
import {faStar as regularStar} from '@fortawesome/free-regular-svg-icons';

const StarRating = ({rating}) => {
    rating = rating ? parseFloat(rating.replace('.', ',')) : 0;
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const remainder = rating - fullStars
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FontAwesomeIcon icon={solidStar} key={`solid-${i}`}/>);
    }

    // Half star
    if (remainder >= 0.5) {
        stars.push(<FontAwesomeIcon icon={faStarHalfStroke} key="half"/>);
    }

    // Empty stars
    const emptyStars = totalStars - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FontAwesomeIcon icon={regularStar} key={`empty-${i}`}/>);
    }

    return (
        <div className={"py-1"}>
            <span className={"text-warning"}>{stars} ({rating})</span>
        </div>
    );
};

export default StarRating;