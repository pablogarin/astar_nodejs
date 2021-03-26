import styled from 'styled-components';

const Label = styled.div`
  font-size: 12pt;
  line-height: 12pt;
  font-weight: 500;
  width: 370px;
  margin: 8px auto;
  text-align: left;
  padding-left: 30px;
  position: relative;
  &:before {
    display: block;
    background: ${props => props.color};
    content: "";
    width: 10px;
    height: 10px;
    border: 1px solid #3333;
    box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px;
    border-radius: 2px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
`

export default Label;
