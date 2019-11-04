// 创建容器和保护层，并统一添加至body
let protectiveLayer:HTMLElement, viewPort:HTMLElement;

function viewPortInit(param){
  const fragment = document.createDocumentFragment();
  protectiveLayer = document.createElement('div');
  protectiveLayer.setAttribute('class', 'pagego-preventClickPop');
  fragment.appendChild(protectiveLayer);
  const tmpScreenPage = document.getElementById('pagego-screenPage');
  if (tmpScreenPage) {
    viewPort = tmpScreenPage
  } else {
    viewPort = document.createElement('div');
    viewPort.setAttribute('class', 'pagego-screenPage');
    if (param.viewportCss) viewPort.setAttribute('style', param.viewportCss);
    fragment.appendChild(viewPort);
  }
  document.body.appendChild(fragment);
}

function showProtect() {
  if (protectiveLayer) protectiveLayer.style.display = 'block';
}

function hideProtect() {
  if (protectiveLayer) protectiveLayer.style.display = 'none';
}

export {viewPortInit, viewPort, showProtect, hideProtect}