/*
  Usage:
  - Import vr-interface to your code:
    <script type="text/javascript" charset="UTF-8" src="path/to/vr-interface.js"></script>

  - Call it in an aframe entity and pass the options to config like the example below:
     <a-entity vr-interface="position: -1 0 0; rotation: 90; dimension: 5 1; gap: 0 0.02; border: 2 #ff0000"></a-entity>

  - To add buttons create a component in your code
    AFRAME.registerComponent('my-component', {
      init: function () {
        const vrInterface = document.querySelector('[vr-interface]').components['vr-interface'];

        vrInterface.addButton('myButton', '#myTexture', function() {
          vrInterface.showMessage('Button pressed');
        });
        vrInterface.addButton('myButton2', '#myTexture2', function() {
          vrInterface.showMessage('Button 2 pressed', 'bottom');
        });
      },
    });

  Properties:
  - visible: visibilty of the interface;
  - position: position relative to the camera;
  - updatePos: whether it is move vr interface with the camera or not;
  - rotation: button rotation in Y-Axis in degrees;
  - dimension: number of lines and columns of the imaginary matrix in which the buttons will be placed;
  - centralize: whether to align buttons to the center, if false they are aligned to the top-left; 
  - buttonSize: individual button size;
  - transparency: whether the textures have transparency;
  - gap: distance beteween the buttons in the x and y axis;
  - messagePos: default position of the message box when it's called;
  - messageColor: text color of the message box;
  - messageBG: background color of the message box;
  - cursorColor: defines the color of the aim cursor;
  - cursorPosition: defines the positon of the aim cursor, usually it doesn't need to change;
  - raycaster: defines near and far properties of the raycaster;
  - border: thickness and color of button border, if nothing is set, no border is added.

  Functions:
  - addButton(buttonName, idOfTexture, callback) - adds a button to the interface
  - showMessage(message, position) - shows message, position parameter is optional
  - hide() - hide the interface
  - show() - make interface visible
  
  Observations:
  - Setting the dimension property correctly is important for displaying the vr interface elements correctly;
  - If the scene's camera is not initialized before calling vr-interface or the number of buttons overflow the dimension property, the buttons may be misplaced. 
*/

AFRAME.registerComponent('vr-interface', {
  schema: {
    visible: { type: 'bool', default: true },
    position: { type: 'vec3', default: { x: -1, y: 0, z: 0 } },
    updatePos: { type: 'bool', default: false },
    rotation: { type: 'number', default: 90 },
    dimension: { type: 'vec2', default: { x: 1, y: 1 } },
    centralize: { type: 'bool', default: true },
    buttonSize: { type: 'vec2', default: { x: 0.30, y: 0.20 } },
    transparency: { type: 'bool', default: false },
    gap: { type: 'vec2', default: { x: 0.00, y: 0.00 } },
    messagePos: {
      default: 'top',
      oneof: ['top', 'bottom', 'left', 'right'],
    },
    messageColor: { type: 'color', default: 'white' },
    messageBG: { type: 'color', default: '#232323' },
    cursorColor: { type: 'color', default: 'white' },
    cursorPosition: { type: 'vec3', default: { x: 0, y: 0, z: -0.9 } },
    raycaster: {
      default: { near: 0, far: 1 },
      parse: function (value) {
        if (typeof value === 'string') {
          let props = value.split(' ');
          return { near: props[0], far: props[1] }
        }
        return value;
      },
      stringify: function (value) {
        return `${value.near} ${value.far}`
      }

    },
    border: {
      default: { thickness: 1, color: null },
      parse: function (value) {
        if (typeof value === 'string') {
          let props = value.split(' ');
          return { thickness: props[0], color: props[1] }
        }
        return value;
      },
      stringify: function (value) {
        return `${value.thickness} ${value.color}`
      }
    },
  },

  init: function () {
    const self = this;
    const data = this.data;

    this.buttons = [];
    this.buttonGeometry = new THREE.PlaneGeometry(1, 1);
    this.camera = document.querySelector('[camera]');
    this.oldCameraPos = new THREE.Vector3().copy(this.camera.object3D.position);
    this.toleratedDifference = 0.01;

    this.referencePoint = new THREE.Vector3();
    this.camera.object3D.getWorldPosition(this.referencePoint);

    this.cursor = document.createElement('a-entity');
    this.cursor.setAttribute('cursor', { fuse: true, fuseTimeout: 1000, });
    this.cursor.setAttribute('raycaster', { near: data.raycaster.near, far: data.raycaster.far, objects: '.vrInterface-button' });
    this.cursor.setAttribute('position', { x: data.cursorPosition.x, y: data.cursorPosition.y, z: data.cursorPosition.z });
    this.cursor.setAttribute('geometry', { primitive: 'ring', radiusInner: 0.007, radiusOuter: 0.015 });
    this.cursor.setAttribute('material', { color: data.cursorColor, shader: 'flat' });
    this.cursor.setAttribute('animation__click', 'property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1');
    this.cursor.setAttribute('animation__fusing', 'property: scale; startEvents: fusing; easing: easeInCubic; dur: 1000; from: 1 1 1; to: 0.1 0.1 0.1');
    this.cursor.setAttribute('animation__fusing2', 'property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 150; to: 1 1 1');

    this.camera.appendChild(this.cursor);

    this.message = document.createElement('a-entity');
    this.message.setAttribute('text', { align: 'center', width: 1, height: 1, color: new THREE.Color(data.messageColor) });
    this.message.setAttribute('geometry', { primitive: 'plane', height: 0.1, width: 1 });
    this.message.setAttribute('material', { color: new THREE.Color(data.messageBG), transparent: data.transparency, opacity: 0.75 });
    this.message.object3D.visible = false;
    this.el.appendChild(this.message);

    this.borderMaterial = null;
    this.borderGeometry;
    if (data.border.color) {
      this.borderMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(data.border.color),
        linewidth: data.border.thickness
      })
    }

    this.data.rotation = data.rotation * Math.PI / 180; // converts deg to rad

    this.el.addEventListener('click', (evt) => self.clickHandle(evt)); // click == fuse click
    this.el.sceneEl.addEventListener('enter-vr', () => { self.isVr = true; console.log(this.camera.object3D.position) });
    this.el.sceneEl.addEventListener('exit-vr', () => { self.isVr = false; });
  },
  tick: function () {
    if (this.data.updatePos) {
      this.camera.object3D.getWorldPosition(this.referencePoint);

      if (Math.abs(this.oldCameraPos.x - this.referencePoint.x) > this.toleratedDifference
        || Math.abs(this.oldCameraPos.y - this.referencePoint.y) > this.toleratedDifference
        || Math.abs(this.oldCameraPos.z - this.referencePoint.z) > this.toleratedDifference
      ) {
        this.oldCameraPos.copy(this.referencePoint);

        if (AFRAME.utils.device.isMobile() && this.isVr) {
          this.referencePoint.y += this.camera.object3D.position.y;
        }

        for (let k = 0; k < this.buttons.length; k++) {
          this.positionate(this.buttons[k], k);
          if (this.data.centralize) this.centralize(this.buttons[k]);
          this.positionateBorder(this.buttons[k]);
        }

        if (this.message.object3D.visible) {
          this.positionateMessage(this.pos);
        }
      }
    }
  },
  update: function (oldData) {
    const el = this.el;
    const data = this.data;

    // If `oldData` is empty, then this means we're in the initialization process. No need to update.
    if (Object.keys(oldData).length === 0) { return; }

    if (oldData.visible !== data.visible) {
      if (data.visible) this.show();
      else this.hide();
    }

    if (oldData.rotation !== data.rotation) {
      this.data.rotation = data.rotation * Math.PI / 180; // converts deg to rad
    }

    // if position, dimension, button size, gap, or rotation changes it's the same processes to change the buttons
    if (
      oldData.position.x !== data.position.x || oldData.position.y !== data.position.y || oldData.position.z !== data.position.z ||
      oldData.dimension.x !== data.dimension.x || oldData.dimension.y !== data.dimension.y ||
      oldData.buttonSize.x !== data.buttonSize.x || oldData.buttonSize.y !== data.buttonSize.y ||
      oldData.gap.x !== data.gap.x || oldData.gap.y !== data.gap.y ||
      oldData.rotation !== data.rotation
    ) {
      for (let k = 0; k < this.buttons.length; k++) {
        this.buttons[k].rotation.y = data.rotation;

        this.positionate(this.buttons[k], k);
        if (oldData.buttonSize.x !== data.buttonSize.x || oldData.buttonSize.y !== data.buttonSize.y) {
          this.buttons[k].scale.set(data.buttonSize.x, data.buttonSize.y, 1);
        }

        if (data.centralize) {
          this.centralize(this.buttons[k]);
        }

        if (this.borderMaterial) {
          this.positionateBorder(this.buttons[k])
        }
      }
    }
    else if (oldData.centralize !== data.centralize) { // the previous option updates the centralization already
      for (let k = 0; k < this.buttons.length; k++) {
        if (data.centralize) {
          this.centralize(this.buttons[k]);
        }
        else {
          this.decentralize(this.buttons[k]);
        }
        if (this.borderMaterial) {
          this.positionateBorder(this.buttons[k])
        }
      }
    }

    if (oldData.cursorColor !== data.cursorColor) {
      this.cursor.setAttribute('material', { color: data.cursorColor, shader: 'flat' });
    }

    if (oldData.cursorPosition !== data.cursorPosition) {
      this.cursor.setAttribute('position', { x: data.cursorPosition.x, y: data.cursorPosition.y, z: data.cursorPosition.z });
    }

    if (oldData.raycaster.near !== data.raycaster.near || oldData.raycaster.far !== data.raycaster.far) {
      this.cursor.setAttribute('raycaster', { near: data.raycaster.near, far: data.raycaster.far });
    }

    if (oldData.border.thickness !== data.border.thickness || oldData.border.color !== data.border.color) {
      this.borderMaterial.linewidth = data.border.thickness;
      this.borderMaterial.color = new THREE.Color(data.border.color);
      this.borderMaterial.needsUpdate = true;
    }

  },
  clickHandle: function (evt) {
    let name = evt.detail.intersection.object.name;

    for (let button of this.buttons) {
      if (button.name === name && typeof button.onClick === 'function') {
        button.onClick();
      }
    }
  },
  addButton: function (name, img, callback) {
    const data = this.data;

    if (data.dimension.x * data.dimension.y <= this.buttons.length) {
      console.warn('VRInterface: Number of buttons doesn\'t match dimensions limits.')
    }

    let image = document.querySelector(img);
    let texture = new THREE.Texture();

    if (image) {
      texture.image = image;
      texture.needsUpdate = true;
    }

    let button = new THREE.Mesh(
      this.buttonGeometry,
      new THREE.MeshBasicMaterial({ map: texture, transparent: data.transparency })
    );
    button.name = name;
    button.onClick = callback;
    button.scale.set(data.buttonSize.x, data.buttonSize.y, 1);
    button.rotation.y = data.rotation;

    this.positionate(button);
    this.centralize(button);

    const entity = document.createElement('a-entity');
    entity.setObject3D(button.name, button);

    if (this.borderMaterial) { // if there's a material, the user wants a border
      let border = new THREE.LineSegments(
        new THREE.EdgesGeometry(button.geometry),
        this.borderMaterial
      )
      button.border = border;
      this.positionateBorder(button);
      this.el.setObject3D(button.name + '-border', border);
    }

    entity.classList.add('vrInterface-button');
    this.buttons.push(button);
    this.el.appendChild(entity);
  },
  showMessage: function (text, pos) {
    const msg = this.message.object3D;

    if (!pos && pos !== 'top' && pos !== 'bottom') {
      this.pos = this.data.messagePos;
    }
    else {
      this.pos = pos;
    }

    msg.el.setAttribute('text', { value: text });
    msg.children[1].scale.x = text.length * 0.025;
    msg.rotation.y = this.data.rotation;

    this.positionateMessage(this.pos);

    msg.visible = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => msg.visible = false, 3000);
  },
  positionate: function (button, length) {
    const data = this.data;

    let n = typeof length === 'number' ? length : this.buttons.length; // index of the n-th button
    let i = Math.trunc(n / data.dimension.y); // index of the line
    let j = n - data.dimension.y * i; // index of the column

    button.rotation.y = data.rotation;
    button.position.set(
      (this.referencePoint.x + data.position.x) + j * (data.buttonSize.x + data.gap.x) * Math.cos(data.rotation),
      (this.referencePoint.y + data.position.y) - i * (data.buttonSize.y + data.gap.y),
      (this.referencePoint.z + data.position.z) + j * (data.buttonSize.x + data.gap.x) * -Math.sin(data.rotation)
    );

  },
  positionateMessage: function (pos) {
    const msg = this.message.object3D;

    msg.position.copy(this.buttons[0].position);

    if (pos === 'top') {
      msg.position.x += this.data.buttonSize.x * 0.5 * (this.data.dimension.y - 1) * Math.cos(this.data.rotation);
      msg.position.z -= this.data.buttonSize.x * 0.5 * (this.data.dimension.y - 1) * Math.sin(this.data.rotation);
      msg.position.y += (this.data.buttonSize.y + 0.1) * 0.55;
    }
    else if (pos === 'bottom') {
      let offset = (this.data.dimension.x - 1) * (this.data.buttonSize.y + this.data.gap.y);
      msg.position.x += this.data.buttonSize.x * 0.5 * (this.data.dimension.y - 1) * Math.cos(this.data.rotation);
      msg.position.z -= this.data.buttonSize.x * 0.5 * (this.data.dimension.y - 1) * Math.sin(this.data.rotation);
      msg.position.y -= (this.data.buttonSize.y + 0.1) * 0.55 + offset;
    }
    else if (pos === 'left') {
      msg.position.x -= (msg.children[1].scale.x + this.data.buttonSize.x) * 0.51 * Math.cos(this.data.rotation);
      msg.position.z += (msg.children[1].scale.x + this.data.buttonSize.x) * 0.51 * Math.sin(this.data.rotation);
      msg.position.y -= this.data.buttonSize.y * (this.data.dimension.x - 1) * 0.5;
    }
    else if (pos === 'right') {
      let offset = (this.data.dimension.y - 1) * (this.data.buttonSize.x + this.data.gap.x);
      msg.position.x += ((msg.children[1].scale.x + this.data.buttonSize.x) * 0.51 + offset) * Math.cos(this.data.rotation);
      msg.position.z -= ((msg.children[1].scale.x + this.data.buttonSize.x) * 0.51 + offset) * Math.sin(this.data.rotation);
      msg.position.y -= this.data.buttonSize.y * (this.data.dimension.x - 1) * 0.5;
    }
  },
  positionateBorder: function (button) {
    button.border.scale.copy(button.scale);
    button.border.position.copy(button.position);
    button.border.rotation.copy(button.rotation);
  },
  centralize: function (button) {
    button.position.y += this.data.buttonSize.y * 0.5 * (this.data.dimension.x - 1); // data.dimension.x == lines
    button.position.x -= this.data.buttonSize.x * 0.5 * (this.data.dimension.y - 1) * Math.cos(this.data.rotation); // data.dimension.y == columns
    button.position.z += this.data.buttonSize.x * 0.5 * (this.data.dimension.y - 1) * Math.sin(this.data.rotation); // data.dimension.y == columns
  },
  decentralize: function (button) {
    button.position.y -= this.data.buttonSize.y * 0.5 * (this.data.dimension.x - 1); // data.dimension.x == lines
    button.position.x += this.data.buttonSize.x * 0.5 * (this.data.dimension.y - 1) * Math.cos(this.data.rotation); // data.dimension.y == columns
    button.position.z -= this.data.buttonSize.x * 0.5 * (this.data.dimension.y - 1) * Math.sin(this.data.rotation); // data.dimension.y == columns
  },
  setLocation: function (pos, rot) {
    if (typeof rot === 'number') {
      this.data.rotation = rot * Math.PI / 180;
    }

    if (typeof pos === 'string') {
      pos = pos.split(' ');
      if (pos.length >= 3) {
        this.data.position.x = Number.parseFloat(pos[0]);
        this.data.position.y = Number.parseFloat(pos[1]);
        this.data.position.z = Number.parseFloat(pos[2]);
      }
    }

    if (!this.data.updatePos) {
      for (let k = 0; k < this.buttons.length; k++) {
        this.positionate(this.buttons[k], k);
        if (this.data.centralize) this.centralize(this.buttons[k]);
        this.positionateBorder(this.buttons[k]);
      }
    }
  },
  show: function () {
    this.data.visible = true;
    this.el.object3D.visible = true;
    this.cursor.setAttribute('raycaster', { near: this.data.raycaster.near, far: this.data.raycaster.far });
  },
  hide: function () {
    this.data.visible = false;
    this.el.object3D.visible = false;
    this.cursor.setAttribute('raycaster', { near: 0, far: 0 });
  }
});
