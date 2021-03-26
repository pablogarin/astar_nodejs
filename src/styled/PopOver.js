import styled from 'styled-components';

export const PopOver = styled.div`
  display: ${props => props.visible ? 'block' : 'none'};
  position: absolute;
  font-size: 10pt;
  left: 50%;
  top: 30px;
  transform: translateX(-50%);
  text-align: center;
  background: ${props => props.bg};
  color: ${props => props.color};
  width: 200px;
  padding: 12px 16px;
  border-radius: 8px;
  z-index: 100;
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px;
  &:before {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    content: "";
    border-bottom: 10px solid ${props => props.bg};
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }
`
 export const PopOverButton = styled.div`
  display: inline-block;
  cursor: pointer;
  position: relative;
  top: 2px;
  margin: 0 10px;
  border: 2px solid #333;
  background: #333;
  color: #fff;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  z-index: 100;
  user-select: none;
  &:before {
    font-size: 12pt;
    display: block;
    position: absolute;
    content: "?";
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
 `
