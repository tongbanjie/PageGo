import React from 'react';

class _html extends React.Component {
  render() {
    return (
      <html>
        <head>
          <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
          <meta content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="black" name="apple-mobile-web-app-status-bar-style" />
          <meta content="telephone=no" name="format-detection" />
          <meta content="email=no" name="format-detection" />
          <title></title>
        </head>
        <body>
          <script dangerouslySetInnerHTML={{__html: `
              window.initPagePath = '${this.props.path}';
            `
          }}></script>
        </body>
      </html>
      );
  }
}

export default _html;