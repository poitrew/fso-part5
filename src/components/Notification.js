const Notification = ({ message }) => {
    return (
        <div className={`noti ${message.color}`}>
            <p>{message.content}</p>
        </div>
    )
}

export default Notification