import { useState } from 'react';
import { Form, Button, Image, InputGroup, Row } from 'react-bootstrap';
import { CiCirclePlus } from "react-icons/ci";
import { FaImages } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { MdRemoveCircleOutline } from "react-icons/md";

function MessageInput({ sendMessage }) {
  const [msg, setMsg] = useState({
    text: '',
    image: null
  });
  const [showMedia, setshowMedia] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setMsg(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg.text && !msg.image) return;
    sendMessage(msg);
    setMsg({ text: '', image: null });
    setshowMedia(false);
  };

  const handleTextChange = (e) => {
    setMsg(prev => ({ ...prev, text: e.target.value }));
  };

  return (
    <Form onSubmit={handleSubmit} className="fixed-bottom" style={{ width:(window.innerWidth >=1000)?'55%':'100%', height:'60px', marginLeft:(window.innerWidth >=1000)?'35%':'0%'}}>
      {showMedia && (
        <div className="media-options">
          <Form.Label htmlFor="image-upload">
            <Form.Control
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <span style={{cursor:'pointer'}}><FaImages style={{fontSize:'30px'}} /><br />Image</span>
          </Form.Label>
        </div>
      )}

      <InputGroup className="mb-3">

      <CiCirclePlus style={{ color: 'black', fontSize:'30px', margin:'5px' }} type="button"
        className="media-toggle"
        onClick={() => alert('More Input Options is not available at the moment')} />

        <Form.Control type="text" name="text" value={msg.text}
          onChange={handleTextChange}
          placeholder="Type your message..."
        />
        <Button type='submit' variant="outline-secondary" id="button-addon2" className='me-2'>
          <IoSend />
        </Button>
      </InputGroup>


      {msg.image && (
        <div className="image-preview">
          <Image
            src={msg.image}
            alt="Preview"
            style={{ maxWidth: '100px', maxHeight: '100px' }}
          />
          <Button variant='danger' style={{margin:'3px'}}
            type="button"
            onClick={() => setMsg(prev => ({ ...prev, image: null }))}
          >
           <MdRemoveCircleOutline style={{fontSize:'20px', textAlign:'center', alignItems:'center', justifyContent:'center'}} />
          </Button>
        </div>
      )}
    </Form>
  );
}

export default MessageInput;