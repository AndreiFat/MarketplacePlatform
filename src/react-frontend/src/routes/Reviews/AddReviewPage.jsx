import {useParams} from "react-router-dom";
import {useState} from "react";

function AddReviewPage() {
    //productId o sa fie luat din url
    const {productId} = useParams();
    console.log(productId)

    const [description, setDescription] = useState('');
    const [numberOfStars, setNumberOfStars] = useState(0);
    //userul o sa fie luat momentan default

    const handleSubmitEvent = (e) => {
        e.preventDefault();

        const
    }

    return (
        <>
            <div>Here is the review page</div>

        </>
    )
}

export default AddReviewPage