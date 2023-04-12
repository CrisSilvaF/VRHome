import { RGBELoader } from './RGBELoader.js';
import { OrbitControls } from './OrbitControls.js';

AFRAME.registerComponent('orbit-control', {
    schema: {

    },

    init: function () {

        console.log(this.el.object3D);
        this.mainCamera = this.el.object3D.children[0];
        const controls = new OrbitControls(this.mainCamera, this.el.sceneEl.renderer.domElement);
        //controls.enablePan = false;
        //controls.enableZoom = false;
        controls.target.set(0, 0, -2);
        controls.update();
    },

    update: function () { },
    tick: function () { },
    remove: function () { },
    pause: function () { },
    play: function () { }
});

AFRAME.registerComponent('event-system', {
    schema: {
        cubemap: { default: '../hdri/schadowplatz.hdr' },
        exposure: {default: 0.35}
    },
    init: function () {
        console.log(document.querySelector('a-scene').object3D);
        this.sceneEl = this.el.sceneEl;
        console.log(THREE);
        var cubeMap = this.data.cubemap;
        new RGBELoader()
            .load(cubeMap, function (texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                document.querySelector('a-scene').object3D.background = texture;
                document.querySelector('a-scene').object3D.environment = texture;
            });
        this.el.sceneEl.renderer.toneMapping = 3;
        this.el.sceneEl.renderer.toneMappingExposure = this.data.exposure;
        this.el.sceneEl.addEventListener('exit-vr', function () {
            //alert("Exit XR");
            console.log("Exit XR");
            document.getElementById('machineEl').removeAttribute('gltf-model');
            //document.getElementById('machineEl').removeAttribute('models');
        });
    },
    update: function () { },
    tick: function () { },
    remove: function () { },
    pause: function () { },
    play: function () { }
});

AFRAME.registerComponent('models', {
    schema: {},
    init: function () {
        /*this.el.sceneEl.object3D.traverse( function( object ) {

            try{
                object.frustumCulled = false;
            }catch{}
        
        } );*/
        let mainScene = this.el.sceneEl;
        this.el.addEventListener('model-loaded', function () {
            mainScene.object3D.traverse(function (object) {

                try {
                    object.frustumCulled = false;
                } catch { }

            });
            console.log("Loaded!");
        });
        console.log(this.el.object3D);
    },
    update: function () { },
    tick: function () { },
    remove: function () { },
    pause: function () { },
    play: function () { }
});

AFRAME.registerComponent('button', {
    schema: {
        pinchDistance: { default: 0.05 },
        label: { default: 'label' },
        width: { default: 0.08 },
        actionbutton: { default: "lookfront" }
    },

    init: function () {
        var el = this.el;
        var sceneEl = this.el.sceneEl;
        this.worldPosition = new THREE.Vector3();
        this.pinched = false;
        this.wasPinched = false;
        //var labelEl = this.labelEl = document.createElement('a-entity');
        this.bindMethods();


        var labelEl = this.labelEl = document.createElement('a-entity');
        this.color = '#1f3f5f';
        el.setAttribute('geometry', {
            primitive: 'box',
            width: this.data.width,
            height: 0.05,
            depth: 0.005
        });

        labelEl.setAttribute('position', '0 0 0.0025');
        labelEl.setAttribute('text', {
            value: this.data.label,
            color: 'white',
            align: 'center'
        });
        labelEl.setAttribute('scale', '0.5 0.5 0.5');
        this.el.appendChild(labelEl);
        el.setAttribute('material', { color: this.color });
        sceneEl.addEventListener('pinchstarted', this.onPinchStarted);
        sceneEl.addEventListener('pinchended', this.onPinchEnded);
        sceneEl.addEventListener('pinchmoved', this.onPinchMoved);
    },

    bindMethods: function () {
        this.onPinchStarted = this.onPinchStarted.bind(this);
        this.onPinchEnded = this.onPinchEnded.bind(this);
        this.onPinchMoved = this.onPinchMoved.bind(this);
    },

    onPinchStarted: function (evt) {
        var ent = this.el;
        var distance = this.calculatePinchDistance(evt.detail.position);
        if (distance <= this.data.pinchDistance) {
            this.pinched = true;
            //document.getElementById('dText').setAttribute('value', "Pinched!");
            //var btn = document.getElementById(this.data.actionbutton);
            if (this.data.actionbutton === "lookfront") {
                document.getElementById("machineEl").setAttribute("rotation", "0 0 0");
            } else if(this.data.actionbutton === "lookback") {
                document.getElementById("machineEl").setAttribute("rotation", "0 180 0");
            }else{
                try{
                    var top = document.querySelector('a-scene').object3D.getObjectByName('Top');
                    console.log(top);
                    top.visible = !top.visible;
                }catch{
                    console.log("Top not found");
                }
            }
            ent.setAttribute('material', { color: '#5f1f3f' });
        }
    },

    onPinchEnded: function (evt) {
        var ent = this.el;
        //document.getElementById('dText').setAttribute('value', "Cick end!");
        this.pinched = false;
        this.wasPinched = false;
        ent.setAttribute('material', { color: this.color });
    },

    onPinchMoved: function (evt) {
        if (this.pinched) {
        }
    },

    calculatePinchDistance: function (pinchWorldPosition) {
        var el = this.el;
        var worldPosition = this.worldPosition;
        var pinchDistance;

        worldPosition.copy(el.object3D.position);
        el.object3D.parent.updateMatrixWorld();
        el.object3D.parent.localToWorld(worldPosition);

        pinchDistance = worldPosition.distanceTo(pinchWorldPosition);

        return pinchDistance;
    }

});

AFRAME.registerComponent('gui-box', {
    schema: {
        pinchDistance: { default: 0.05 },
        width: { default: .35 },
        height: { default: .2 },
        depth: { default: 0.005 },
        color: { default: '#0f0f0f' }
    },

    init: function () {
        var el = this.el;
        var sceneEl = this.el.sceneEl;
        this.pinched = false;
        this.worldPosition = new THREE.Vector3();
        //var labelEl = this.labelEl = document.createElement('a-entity');
        this.bindMethods();

        el.setAttribute('geometry', {
            primitive: 'box',
            width: this.data.width,
            height: this.data.height,
            depth: this.data.depth
        });

        el.setAttribute('material', {
            color: this.data.color,
            transparent: true,
            opacity: 0.9
        });
        sceneEl.addEventListener('pinchstarted', this.onPinchStarted);
        sceneEl.addEventListener('pinchended', this.onPinchEnded);
        sceneEl.addEventListener('pinchmoved', this.onPinchMoved);
    },

    bindMethods: function () {
        this.onPinchStarted = this.onPinchStarted.bind(this);
        this.onPinchEnded = this.onPinchEnded.bind(this);
        this.onPinchMoved = this.onPinchMoved.bind(this);
    },

    onPinchStarted: function (evt) {
        //document.getElementById('dText').setAttribute('value', "Cicked!");
        var ent = this.el;
        var distance = this.calculatePinchDistance(evt.detail.position);
        if (distance <= this.data.pinchDistance) {
            this.pinched = true;
        }
    },

    onPinchEnded: function (evt) {
        //document.getElementById('dText').setAttribute('value', "Cick end!");
        this.pinched = false;
    },

    onPinchMoved: function (evt) {
        var ent = this.el;
        //document.getElementById('dText').setAttribute('value', this.pinched);
        if (this.pinched) {

            var pos = evt.detail.position.x + " " + evt.detail.position.y + " " + evt.detail.position.z;
            ent.setAttribute('position', pos);
            var hanRotation = evt.target.object3D.children[0].rotation;
            var rot = "-15 " + THREE.Math.radToDeg(-hanRotation.z) + " 0";
            this.el.setAttribute('rotation', rot);
        }
    },

    calculatePinchDistance: function (pinchWorldPosition) {
        var el = this.el;
        var worldPosition = this.worldPosition;
        var pinchDistance;

        worldPosition.copy(el.object3D.position);

        pinchDistance = worldPosition.distanceTo(pinchWorldPosition);

        return pinchDistance;
    }
});

AFRAME.registerComponent('box-collider', {
    schema: {},
    init: function () {
        let el = this.el.object3D;
        el.children[0].add(new THREE.BoxHelper(el.children[0], 0x00ff00));
        //boxHelper.update();
        console.log(el);
    },
    update: function () { },
    tick: function () {
        //this.boxHelper.update();
    },
    remove: function () { },
    pause: function () { },
    play: function () { }
});

AFRAME.registerComponent('hand-teleport', {
    schema: {
        teleportLine: { default: 'teleportLine' }
    },

    dependencies: ['raycaster'],

    init: function () {
        this.isRaycasting = false;
        var el = this.el;
        this.teleportLine = document.getElementById(this.data.teleportLine);
        var sceneEl = this.el.sceneEl;
        this.worldPosition = new THREE.Vector3();
        this.bindMethods();
        //document.getElementById('teleportLine').object3D.visible = false;
        console.log(this.teleportLine.object3D);
        this.el.addEventListener('pinchstarted', this.onPinchStarted);
        this.el.addEventListener('pinchended', this.onPinchEnded);
        this.el.addEventListener('pinchmoved', this.onPinchMoved);

        this.teleportLine.addEventListener('raycaster-intersection', function (evt) {
            console.log(evt.detail);
            this.isRaycasting = true;
            /*document.getElementById('teleportPoint').object3D.position.set(
                evt.detail.intersections[evt.detail.intersections.length - 1].point.x,
                evt.detail.intersections[evt.detail.intersections.length - 1].point.y,
                evt.detail.intersections[evt.detail.intersections.length - 1].point.z
            );*/
        });

    },

    bindMethods: function () {
        this.onPinchStarted = this.onPinchStarted.bind(this);
        this.onPinchEnded = this.onPinchEnded.bind(this);
        this.onPinchMoved = this.onPinchMoved.bind(this);
    },

    update: function () { },
    tick: function () {
        try{
            //console.log(this.teleportLine.components['raycaster'].intersectionDetail.intersections[0]);
            document.getElementById('teleportPoint').object3D.position.set(
                this.teleportLine.components['raycaster'].intersectionDetail.intersections[0].point.x,
                this.teleportLine.components['raycaster'].intersectionDetail.intersections[0].point.y,
                this.teleportLine.components['raycaster'].intersectionDetail.intersections[0].point.z
            );
        }catch{}
        //if (this.isRaycasting) {
            
            /*document.getElementById('teleportPoint').object3D.position.set(
                this.teleportLine.components['raycaster'].intersectionDetail.intersections[this.teleportLine.components['raycaster'].intersectionDetail.intersections - 1].point.x,
                this.teleportLine.components['raycaster'].intersectionDetail.intersections[this.teleportLine.components['raycaster'].intersectionDetail.intersections - 1].point.y,
                this.teleportLine.components['raycaster'].intersectionDetail.intersections[this.teleportLine.components['raycaster'].intersectionDetail.intersections - 1].point.z
            );*/
        //}
    },
    remove: function () { },
    pause: function () { },
    play: function () { },

    onPinchStarted: function (evt) {

        //document.getElementById('handText').setAttribute('value', evt.target.object3D.children[0].position);
        //var myvector = THREE.Vector3(0, 0, 1).localToWorld(evt.target.object3D.children[0].position);
        document.getElementById('teleportPoint').object3D.visible = true;

    },

    onPinchEnded: function (evt) {
        //document.getElementById('dText').setAttribute('value', "Cick end!");
        //this.pinched = false;
        var d = document.getElementById('teleportPoint').object3D;
        var telPos = d.position.x + " " + d.position.y + " " + d.position.z;
        document.getElementById('player').setAttribute('position', telPos);
        this.teleportLine.object3D.visible = false;
        document.getElementById('teleportPoint').object3D.visible = false;
    },

    onPinchMoved: function (evt) {
        try {
            this.teleportLine.object3D.visible = true;
            this.teleportLine.object3D.position.set(
                evt.target.object3D.children[0].position.x,
                evt.target.object3D.children[0].position.y,
                evt.target.object3D.children[0].position.z
            );

            this.teleportLine.object3D.rotation.set(
                evt.target.object3D.children[0].rotation.x,
                evt.target.object3D.children[0].rotation.y,
                evt.target.object3D.children[0].rotation.z
            );

            //document.getElementById('handText').setAttribute('value', rotAbs);

        } catch (e) {
            //document.getElementById('handText').setAttribute('value', e);
        }
    }
});