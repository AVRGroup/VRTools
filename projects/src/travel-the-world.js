AFRAME.registerComponent('isvr-photosphere-menu-thumb', {

    init: function() {

      this.el.addEventListener('click', this.onClick.bind(this));
      
    },

    onClick: function(evt) {

      var position = this.el.getAttribute('position');

      /* prevent immediate selection of image after menu appears */
      if (this.el.parentEl.getAttribute('visible') && position.z == 0.5) {

        var id = this.el.getAttribute('data-image-id');
        id = '#img-photosphere-' + id;
      
          document.querySelector('#photosphere-menu').setAttribute('visible', false);
          document.querySelector('#cursor').setAttribute('visible', false);
          document.querySelector('#photosphere').setAttribute('material', 'src', id);

      }

    },

    update: function(oldData) {
    },

    remove: function() {
    }

});


AFRAME.registerComponent('isvr-photosphere-menu-navigation', {

 
    responseHandler: function () {

        var image_thumb_elems = document.getElementsByClassName('img-photosphere-thumb');
        for (var i = 0; i < image_thumb_elems.length; i++) {
            image_thumb_elems[i].setAttribute('visible', false);
            image_thumb_elems[i].setAttribute('opacity', 0);
        }


            var obj = JSON.parse(this.xmlhttp.responseText);
            for (var i = 0; i < obj.data.length; i++) {

                var image_thumb_elem = document.getElementsByClassName('img-photosphere-thumb')[i];
                var id = obj.from + i;
                image_thumb_elem.setAttribute('data-image-id', id);

                var image_thumb = new Image();
                image_thumb.onload = (function (elem) {
                    return function () {
                        elem.setAttribute('visible', true);
                        elem.emit('fade');
                    }
                }(image_thumb_elem));
                image_thumb.src = obj.data[i]['image-thumbnail'];
                image_thumb_elem.setAttribute('src', image_thumb.src);

            }

        

    },

    update: function (oldData) {
    },

    remove: function () {
    }

});

AFRAME.registerComponent('isvr-photosphere-menu', {

    init: function () {

        window.addEventListener('touchstart', this.onClick.bind(this));
        window.addEventListener('keyup', this.onKeyup.bind(this));

        this.yaxis = new THREE.Vector3(0, 1, 0);
        this.zaxis = new THREE.Vector3(0, 0, 1);

        this.pivot = new THREE.Object3D();
        this.el.object3D.position.set(0, document.querySelector('#camera').object3D.getWorldPosition().y, -4);

        this.el.sceneEl.object3D.add(this.pivot);
        this.pivot.add(this.el.object3D);

    },

    onClick: function (evt) {

        this.handleMenu();

    },

    onKeyup: function (evt) {

        /* space bar */
        if (evt.keyCode == '32') {

            this.handleMenu();

        }

    },

    handleMenu: function () {

        if (document.getElementsByClassName('img-photosphere-thumb').length > 1 && this.el.getAttribute('visible') == false) {

            var direction = this.zaxis.clone();
            direction.applyQuaternion(document.querySelector('#camera').object3D.quaternion);
            var ycomponent = this.yaxis.clone().multiplyScalar(direction.dot(this.yaxis));
            direction.sub(ycomponent);
            direction.normalize();

            this.pivot.quaternion.setFromUnitVectors(this.zaxis, direction);
            this.pivot.position.copy(document.querySelector('#camera').object3D.getWorldPosition());

            this.el.setAttribute('visible', true);
            document.querySelector('#cursor').setAttribute('visible', true);

        }
        else {
            this.el.setAttribute('visible', false);
            document.querySelector('#cursor').setAttribute('visible', false);
        }
    },

    update: function (oldData) {
    },

    remove: function () {
    }

});


