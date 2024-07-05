function OrderStatusBadge({orderStatus}) {
    const getLatestStatus = (orderStatus) => {
        const statusObject = JSON.parse(orderStatus);
        const {statusHistory} = statusObject;
        return statusHistory.sort((a, b) => b.timestamp - a.timestamp)[0];
    };

    const selectBadge = (orderStatus) => {
        switch (orderStatus) {
            case "PENDING":
                return <span className='p-2 color-pending badge fw-normal'>PENDING</span>
            case "DELIVERED":
                return <span className='p-2 color-delivery badge fw-normal'>DELIVERED</span>
            case "DONE":
                return <span className='p-2 color-done badge fw-normal'>DONE</span>
            case "ON DELIVERY":
                return <span className='p-2 color-orange badge fw-normal'>ON DELIVERY</span>
            case "CANCELED":
                return <span className='p-2 color-red badge fw-normal'>CANCELED</span>
        }
    }

    return (
        <>
            {selectBadge(getLatestStatus(orderStatus).status)}
        </>
    )
}

export default OrderStatusBadge