import styled from 'styled-components';

const Label = styled.div`
  font-size: 12pt;
  line-height: 12pt;
  font-weight: 500;
  width: 386px;
  margin: 8px auto;
  text-align: left;
  padding-left: 14px;
  position: relative;
  &:before {
    display: block;
    background: ${props => props.color};
    content: "";
    width: 10px;
    height: 10px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
`

export default Label;
