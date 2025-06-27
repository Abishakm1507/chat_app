import { Image } from 'react-bootstrap';

export default function Media() {
    const selectedChat = JSON.parse(localStorage.getItem("selectedChat")) || "";
    const chat = JSON.parse(localStorage.getItem(selectedChat)) || []

    return (
        <div className='mx-5'>
            <h2>Media</h2>
            {chat.filter(c => c.image).map((c, index) => (
                    <Image key={index} src={c.image} alt="chatImage" style={{ maxWidth: '200px', margin: '10px' }} />
                ))
            }
        </div>
    );
}