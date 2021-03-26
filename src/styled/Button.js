import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.bg ? props.bg : '#9F9'};
  text-transform: uppercase;
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid #3333;
  margin: 0 10px;
  position: relative;
  transition: box-shadow .1s ease;
  cursor: pointer;
  font-weight: bold;
  color: ${props => props.textColor ? props.textColor : '#333d'};
  &[disabled] {
    transition: none;
    color: #888;
    background: #ccc;
  }
  &:active, &:focus {
    outline: none;
  }
  &:not([disabled]):hover {
    box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px;
    &:before {
      display: block;
      position:absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: #3332;
      content: "";
    }
  }
`

export default Button;
