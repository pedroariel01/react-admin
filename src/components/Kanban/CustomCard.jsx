import React from "react";

import {
  MovableCardWrapper,
  CardHeader,
  CardRightContent,
  CardTitle,
  Detail,
  Footer
} from "react-trello/dist/styles/Base";

import Tag from "react-trello/dist/components/Card/Tag";

class CustomCard extends React.Component {
  onDelete = e => {
    this.props.onDelete();
    e.stopPropagation();
  };

  render() {
    const {
      showDeleteButton,
      style,
      tagStyle,
      onClick,
      onDelete,
      className,
      id,
      title,
      label,
      description,
      tags,
      cardDraggable
    } = this.props;

    return (
      <MovableCardWrapper
        data-id={id}
        onClick={onClick}
        style={style}
        className={className}
      >
        <CardHeader>
          <CardTitle
            draggable={cardDraggable}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <CardRightContent>{label}</CardRightContent>
          {/* {showDeleteButton && <DeleteButton onClick={this.onDelete} />} */}
        </CardHeader>
        <Detail>{description}</Detail>
        {tags && tags.length > 0 && (
          <Footer>
            {tags.map(tag => (
              <Tag key={tag.title} {...tag} tagStyle={tagStyle} />
            ))}
          </Footer>
        )}
      </MovableCardWrapper>
    );
  }
}

export default CustomCard;
