import { Button } from "react-bootstrap";

const CustomButton = ({label, onclick, color}) => {
    return(
        <Button type="submit" onClick={onclick} variant={color} style={{margin:'10px'}}>{label}</Button>
    )
}

export default CustomButton;