window.activateAR = async function (model) {
    let character = document.getElementById('machineEl');
    try {
        document.querySelector('a-scene').enterAR();
        character.setAttribute('models', '');
        character.setAttribute('gltf-model', "../../glbs/" + model);
        //document.getElementById('sceneSky').object3D.visible = false;
        document.getElementById('sceneFloor').object3D.visible = false;
        var modelName = model.split('.')[0];
        document.getElementById('sText').setAttribute('text', 'value:' + modelName);
    } catch {
        alert("AR is not Supported");
    }

}

window.activateVR = async function (model) {
    let character = document.getElementById('machineEl');
    try {
        document.querySelector('a-scene').enterVR();
        character.setAttribute('gltf-model', "../../glbs/" + model);
        character.setAttribute('models', '');
        document.getElementById('sceneFloor').object3D.visible = true;
        //console.log(character.object3D);
        var modelName = model.split('.')[0];
        document.getElementById('sText').setAttribute('text', 'value:' + modelName);
    } catch {
        alert("VR is not Supported");
    }
}

window.activateViewer = async function (model) {
    let character = document.getElementById('machineEl');
    try {
        document.getElementById('viewer').removeAttribute('hidden');
        document.getElementById('modelList').setAttribute('hidden', '');
        character.setAttribute('gltf-model', "../../glbs/" + model);
        character.setAttribute('models', '');
        document.getElementById('sceneFloor').object3D.visible = false;
        
        //document.querySelector('a-scene').
        //console.log(character.object3D);
        var modelName = model.split('.')[0];
        document.getElementById('sText').setAttribute('text', 'value:' + modelName);
        document.querySelector('a-scene').resize();
        //character.setAttribute('box-collider', '');
    } catch {
        alert("Web viewer is not Supported");
    }
}

window.closeViewer = async function () {
    console.log("Exit XR");
    document.getElementById('machineEl').removeAttribute('gltf-model');
    document.getElementById('modelList').removeAttribute('hidden');
    document.getElementById('viewer').setAttribute('hidden', '');
}