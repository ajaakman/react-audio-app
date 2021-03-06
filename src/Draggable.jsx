import React, { Component } from "react";
import styled, { css } from "styled-components";

class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,

      originalX: 0,
      originalY: 0,

      translateX: 0,
      translateY: 0,

      lastTranslateX: 0,
      lastTranslateY: 0
    };
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = ({ clientX, clientY }) => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);

    if (this.props.onDragStart) this.props.onDragStart();

    this.setState({
      originalX: clientX,
      originalY: clientY,
      isDragging: true
    });
  };

  handleMouseMove = ({ clientX, clientY }) => {
    if (!this.state.isDragging) return;

    this.setState(
      prevState => ({
        translateX: clientX - prevState.originalX + prevState.lastTranslateX,
        translateY: clientY - prevState.originalY + prevState.lastTranslateY
      }),
      () => {
        if (this.props.onDrag) {
          this.props.onDrag({
            translateX: this.state.translateX,
            translateY: this.state.translateY
          });
        }
      }
    );
  };

  handleMouseUp = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    this.setState(
      {
        originalX: 0,
        originalY: 0,
        lastTranslateX: this.state.translateX,
        lastTranslateY: this.state.translateY,

        isDragging: false
      },
      () => {
        if (this.props.onDragEnd) this.props.onDragEnd();
      }
    );
  };

  render() {
    return (
      <Container
        onMouseDown={this.handleMouseDown}
        x={this.state.translateX}
        y={this.state.translateY}
        isDragging={this.state.isDragging}
      >
        {this.props.children}
      </Container>
    );
  }
}

export default Draggable;

const Container = styled.div.attrs(props => ({
  style: { transform: `translate(${props.x}px, ${props.y}px)` }
}))`
  cursor: grab;

  ${({ isDragging }) =>
    isDragging &&
    css`
      opacity: 0.7;
      cursor: grabbing;
    `};
`;
