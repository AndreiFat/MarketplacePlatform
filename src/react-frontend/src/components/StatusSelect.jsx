import {Form} from "react-bootstrap";
import {useState} from "react";
import {useLocalState} from "../Utilities/useLocalState.js";


const StatusSelect = ({order, status}) => {
    const apiURL = import.meta.env.VITE_API_URL;
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [currentStatusId, setCurrentStatusId] = useState(null);
    // Parse the status history from the order.status JSON string
    const statusHistory = JSON.parse(order.status).statusHistory;

    // Extract the list of existing statuses from the status history
    const existingStatuses = statusHistory.map(entry => entry.status);

    // Filter the status array to exclude already set statuses
    const availableStatuses = status.filter(item => !existingStatuses.includes(item));

    const handleStatusUpdate = async (selectedStatusId, id, order) => {
        const selectedStatus = status[selectedStatusId];
        const timestamp = new Date().toISOString();


        // Create a new status update object
        const statusUpdate = {
            status: selectedStatus,
            timestamp: timestamp
        };
        try {
            // Parse the current status history JSON string from order.status
            const currentStatusHistory = JSON.parse(order.status).statusHistory;

            // Check if the selected status already exists in statusHistory
            const statusExists = currentStatusHistory.some(entry => entry.status === selectedStatus);

            if (statusExists) {
                console.log('Status already exists:', selectedStatus);
                return; // Exit function if status already exists
            }

            // Append new status update to current status history
            const updatedStatusHistory = [...currentStatusHistory, statusUpdate];

            // Prepare updated status JSON
            const updatedStatusJson = JSON.stringify({statusHistory: updatedStatusHistory});

            // Update order status in backend
            const response = await fetch(`${apiURL}/orders/editOrderStatus/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: 'PUT',
                body: updatedStatusJson
            });

            if (response.ok) {
                console.log('Status updated successfully:', statusUpdate);

                // Optionally update orders list or other UI components
            } else {
                console.error('Failed to update status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    const handleChange = (e, orderId, order) => {
        const selectedStatusId = parseInt(e.target.value, 10);
        console.log(selectedStatusId)
        setCurrentStatusId(selectedStatusId);
        handleStatusUpdate(selectedStatusId, orderId, order);
        window.location.reload()
    };

    return (
        <Form.Select
            aria-label="Select Status"
            size="sm"
            name="status"
            key={order.id}
            value={status.indexOf(order.status)}
            onChange={(e) => handleChange(e, order.id, order)}
        >
            <option key={null} value="default" defaultValue>Select Status</option>
            {availableStatuses.map((item) => (
                <option key={item} value={status.indexOf(item)}>{item}</option>
            ))}
        </Form.Select>
    );
};

export default StatusSelect