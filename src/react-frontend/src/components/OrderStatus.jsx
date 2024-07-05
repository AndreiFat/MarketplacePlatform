import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faClock, faTruckFast, faTruckRampBox} from "@fortawesome/free-solid-svg-icons";
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component";

const OrderStatus = ({orderStatus}) => {
    // Parse the JSON string from status
    const statusObject = JSON.parse(orderStatus);
    const status = ["PENDING", "DELIVERED", "DONE", "ON DELIVERY"];
    const canceled = "CANCELED";

    const uncheckedStatus = {
        statusHistory: [
            {
                status: "PENDING",
                timestamp: ""
            },
            {
                status: "ON DELIVERY",
                timestamp: ""
            },

            {
                status: "DELIVERED",
                timestamp: ""
            },
            {
                status: "DONE",
                timestamp: ""
            }
        ]
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', {month: 'short'});
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDate = `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
        const formattedTime = `${hours}:${minutes}`;

        return `${formattedDate} ${formattedTime}`;
    };

    uncheckedStatus.statusHistory.forEach(uncheckedItem => {
        // Find matching item in statusHistoryFromDB
        const dbItem = statusObject.statusHistory.find(dbItem => dbItem.status === uncheckedItem.status);

        // Update timestamp if dbItem exists
        if (dbItem) {
            uncheckedItem.timestamp = dbItem.timestamp;
        }
    });

    const selectBadge = (givenStatus, timestamp) => {
        switch (givenStatus) {
            case status[0]:
                return <div
                    className={timestamp ? "rounded-pill border-2 d-flex justify-content-center align-items-center border-done" : ("rounded-pill border border-2 d-flex justify-content-center align-items-center")}
                    style={{width: 54, height: 54}}>
                    <FontAwesomeIcon
                        className={timestamp ? "text-done" : "text-dark-emphasis"}
                        size={"xl"}
                        icon={faClock}/>
                </div>
            case status[1]:
                return <div
                    className={timestamp ? "rounded-pill border-2 d-flex justify-content-center align-items-center border-done" : ("rounded-pill border border-2 d-flex justify-content-center align-items-center")}
                    style={{width: 54, height: 54}}>
                    <FontAwesomeIcon
                        className={timestamp ? "text-done" : "text-dark-emphasis"} size={"xl"}
                        icon={faTruckRampBox}/></div>
            case status[2]:
                return <div
                    className={timestamp ? "rounded-pill border-2 d-flex justify-content-center align-items-center border-done" : ("rounded-pill border border-2 d-flex justify-content-center align-items-center")}
                    style={{width: 54, height: 54}}>
                    <FontAwesomeIcon className={timestamp ? "text-done" : "text-dark-emphasis"} size={"xl"}
                                     icon={faCircleCheck}/></div>
            case status[3]:
                return <div
                    className={timestamp ? "rounded-pill border-2 d-flex justify-content-center align-items-center border-done" : ("rounded-pill border border-2 d-flex justify-content-center align-items-center")}
                    style={{width: 54, height: 54}}>
                    <FontAwesomeIcon className={timestamp ? "text-done" : "text-dark-emphasis"} size={"xl"}
                                     icon={faTruckFast}/></div>
            // case status[4]:
            //     return <span className='p-2 color-red badge fw-normal'>CANCELED</span>
            default:
                return <FontAwesomeIcon className={"text-dark-emphasis"} size={"xl"} icon={faClock}/>
        }
    }
    return (
        <div>
            <VerticalTimeline>
                {uncheckedStatus.statusHistory.map((event, index) => (
                    <div
                        className="d-flex gap-3 align-items-center mb-3"
                        key={index}>
                        <VerticalTimelineElement
                            icon={selectBadge(event.status, event.timestamp)}
                        ></VerticalTimelineElement>
                        <div>
                            <h6 className="vertical-timeline-element-title mb-0 fw-medium">{event.status}</h6>
                            <p className="fs-7 mb-0 fw-light text-secondary-emphasis">{event.timestamp !== "" ? formatTimestamp(event.timestamp) : ""}</p>
                        </div>
                    </div>
                ))}
            </VerticalTimeline>
        </div>
    );
};

export default OrderStatus