import React, { useState, useEffect } from "react";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CustomBreadcrumb = (props) => {
  return (
    <Breadcrumb>
      {props.home === 0 ? (
        <LinkContainer to={"/"}>
          <Breadcrumb.Item active={false}>Dashboard</Breadcrumb.Item>
        </LinkContainer>
      ) : (
        <LinkContainer to={"/user"}>
          <Breadcrumb.Item active={false}>User DashBoard</Breadcrumb.Item>
        </LinkContainer>
      )}
      <LinkContainer to={props.link}>
        <Breadcrumb.Item active={true}>{props.name}</Breadcrumb.Item>
      </LinkContainer>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
