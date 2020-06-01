import React from 'react';
import styled from '@emotion/styled';
import { StaticQuery, graphql } from 'gatsby';
import Link from './link';
import config from '../../config.js';

const isSearchEnabled = config.header.search && config.header.search.enabled ? true : false;

let searchIndices = [];

if (isSearchEnabled && config.header.search.indexName) {
  searchIndices.push({
    name: `${config.header.search.indexName}`,
    title: `Results`,
    hitComp: `PageHit`,
  });
}

const StyledBgDiv = styled('div')`
  .home-header {
    margin-top: 0;
    border-bottom: none;
    font-weight: 900;
    font-size: 48px;
    letter-spacing: -2px;
  }

  .link {
    box-shadow: none;
    text-decoration: none;
    color: inherit;
  }
  position: relative;
  width: 100%;
  height: 60px;
  background: linear-gradient(72deg, #380036, #0cbaba);

  @media (max-width: 767px) {
    display: block;
  }
`;

const Header = () => (
  <StaticQuery
    query={graphql`
      query headerTitleQuery {
        site {
          siteMetadata {
            githubUrl
            helpUrl
            tweetText
            headerLinks {
              link
              text
            }
          }
        }
      }
    `}
    render={data => {
      console.log(data);

      return (
        <StyledBgDiv>
          <h1 className="home-header">
            <Link to={`/`} className="link"></Link>
          </h1>
        </StyledBgDiv>
      );
    }}
  />
);

export default Header;
