import React from 'react';
import './Seekbar.css';

export default class Seekbar extends React.Component {
    state = {
        isDragging: false
    }

    handleRef = (el) => {
        this.el = el;
    }

    handleMouseDown = (e) => {
        console.log('mousedown');
        window.addEventListener('mousemove', this.handleMouseMove, false);
        window.addEventListener('mouseup', this.handleMouseUp, false);
        this.setState({ isDragging: true });
        this.handleMouseMove(e);
    }

    handleTouchStart = (e) => {
        console.log('touchstart');
        window.addEventListener('touchmove', this.handleMouseMove, false);
        window.addEventListener('touchend', this.handleTouchEnd, false);
        this.setState({ isDragging: true });
        this.handleMouseMove(e);
    }

    handleMouseMove = (e) => {
        e.preventDefault();
        const x = e.clientX - this.el.offsetLeft;
        const xFac = x / this.el.offsetWidth;
        const dragValue = this.props.total * xFac;
        this.setState({ dragValue });
    }

    handleMouseUp = (e) => {
        const { onChange } = this.props;
        const { dragValue } = this.state;
        
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        this.setState({ isDragging: false });
        
        if (onChange)
            onChange({ target: { value: dragValue } });
    }

    handleTouchEnd = (e) => {
        const { onChange } = this.props;
        const { dragValue } = this.state;
        
        window.removeEventListener('touchmove', this.handleMouseMove);
        window.removeEventListener('touchend', this.handleTouchEnd);
        this.setState({ isDragging: false });
        
        if (onChange)
            onChange({ target: { value: dragValue } });
    }

    render() {
        const { value, total, style } = this.props;
        const { isDragging, dragValue } = this.state;
        const thumbValue = isDragging ? dragValue : value;

        return (
            <div className={'seekbar' + (isDragging ? ' dragging' : '')} ref={this.handleRef} style={style} onMouseDown={this.handleMouseDown} onTouchStart={this.handleTouchStart}>
                <div className="seekbar-background">
                    <div className="seekbar-value" style={{ width: `${thumbValue/total*100}%` }}></div>
                </div>
            </div>
        )
    }
}