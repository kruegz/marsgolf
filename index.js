class Ball {
    constructor(scene) {
        this.scene = scene;
        this.mesh = BABYLON.Mesh.CreateSphere('sphere1', 16, 1, this.scene);
        this.mesh.position = new BABYLON.Vector3(-150, 40, -100);

        var ballTextureUrl = "ballTexture.jpg";
        this.material = new BABYLON.StandardMaterial("ballMat", this.scene);
        this.material.diffuseTexture = new BABYLON.Texture(ballTextureUrl, this.scene);
        this.material.specularTexture = new BABYLON.Texture(ballTextureUrl, this.scene);
        this.material.emissiveTexture = new BABYLON.Texture(ballTextureUrl, this.scene);
        this.material.ambientTexture = new BABYLON.Texture(ballTextureUrl, this.scene);

        this.mesh.material = this.material;

        // Physics impostor
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, friction: 5.0, restitution: 0.3 }, this.scene);

    }
}

window.addEventListener('DOMContentLoaded', function(){
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Purple();

        
        // Physics
        scene.enablePhysics(null, new BABYLON.CannonJSPlugin());

        // Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 50, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        var light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0.2, -1, 0), scene);
        light.position = new BABYLON.Vector3(0, 80, 0);

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

        // Ball
        var ball = new Ball();

        camera.lockedTarget = ball.mesh; // target any mesh or object with a "position" Vector3
        scene.activeCamera = camera;

        shadowGenerator.addShadowCaster(ball.mesh);


        // Ground
        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "groundHeightmap.jpg", 2000, 2000, 500, 0, 20, scene, false, () => {
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction: 5.0 }, scene);
        });

        var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
        var groundTextureUrl = "groundTexture.jpg";
        // var groundTextureUrl = "https://www.astrobio.net/wp-content/uploads/2018/09/Mars_Express_view_of_Cerberus_Fossae_highlight_mob.jpg";

        groundMat.diffuseTexture = new BABYLON.Texture(groundTextureUrl, scene);
        groundMat.specularTexture = new BABYLON.Texture(groundTextureUrl, scene);
        groundMat.emissiveTexture = new BABYLON.Texture(groundTextureUrl, scene);
        groundMat.ambientTexture = new BABYLON.Texture(groundTextureUrl, scene);

        ground.material = groundMat;
        ground.receiveShadows = true;

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:2000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("sunsetflat", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;



        //Impulse Settings
        var impulseDirection = new BABYLON.Vector3(0, 1, 0);
        var impulseMagnitude = 50;
        var rotation = new BABYLON.Vector3(0, 0, 0);
        var contactLocalRefPoint = BABYLON.Vector3.Zero();

        var Pulse = function() {
            // Aim towards camera direction
            var cameraDirection = camera.getFrontPosition(1).subtract(camera.position);
            impulseDirection.x = cameraDirection.x;
            impulseDirection.z = cameraDirection.z;

            var translatedRotation = new BABYLON.Vector3(0, 0, 0);

            // translatedRotation.x = rotation.x*cameraDirection.x + rotation.z*cameraDirection.z;
            // translatedRotation.y = rotation.y;
            // translatedRotation.z = -rotation.x*cameraDirection.z + rotation.y*cameraDirection.x;

            translatedRotation.x = cameraDirection.x;
            translatedRotation.y = 0;
            translatedRotation.z = cameraDirection.z;

            translatedRotation = translatedRotation.scale(rotation.x);

            translatedRotation.y = rotation.y;

            console.log("cameraDirection", cameraDirection);
            console.log("rotation", rotation);
            console.log("translatedRotation", translatedRotation);

            // Apply impulse
            ball.mesh.physicsImpostor.applyImpulse(impulseDirection.scale(impulseMagnitude), ball.mesh.getAbsolutePosition().add(contactLocalRefPoint));

            // Apply rotation
            setTimeout(() => {
                ball.mesh.physicsImpostor.setAngularVelocity(translatedRotation);
            }, 100);
        }
        
        //GUI
        
        var changeLoft = function(value) {
            impulseDirection.y = value;
        }

        var magnitude = function(value) {
            impulseMagnitude = value;
        }

        var frictionBox = function(value) {
            ball.physicsImpostor.friction = value;
        }

        var frictionGround = function(value) {
            ground.physicsImpostor.friction = value;
        }

        var spinX = function(value) {
            rotation.x = value;
        }

        var spinY = function(value) {
            rotation.y = value;
        }

        var spinZ = function(value) {
            rotation.z = value;
        }
        
        var displayDValue = function(value) {
            return Math.floor(value * 100) / 100;
        }

        var displayMValue = function(value) {
            return Math.floor(value);
        }

        var displayFValue = function(value) {
            return Math.floor(value * 10) / 10;
        }
        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var selectBox = new BABYLON.GUI.SelectionPanel("spi");
        selectBox.width = 0.25;
        selectBox.height = 0.8;
        selectBox.background = "#1388AF";
        selectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        selectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
         
        advancedTexture.addControl(selectBox);

        var impulseMGroup = new BABYLON.GUI.SliderGroup("Control", "S");
        impulseMGroup.addSlider("Power", magnitude, "units", 0, 100, 50, displayMValue);
        impulseMGroup.addSlider("Loft", changeLoft, "units", 0, 1, 1, displayDValue);

        var contactGroup = new BABYLON.GUI.SliderGroup("Contact Position", "S");
        contactGroup.addSlider("SpinX", spinX, "units", -100, 100, 0, displayDValue); 
        contactGroup.addSlider("SpinY", spinY, "units", -100, 100, 0, displayDValue); 
        contactGroup.addSlider("SpinZ", spinZ, "units", -100, 100, 0, displayDValue); 

        selectBox.addGroup(impulseMGroup);
        selectBox.addGroup(contactGroup);

        var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Swing");
        button.width = 0.2;
        button.height = "40px";
        button.color = "white";
        button.background = "#1388AF";
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.top = "-10px";

        button.onPointerClickObservable.add(Pulse)
        advancedTexture.addControl(button);var selectBox = new BABYLON.GUI.SelectionPanel("spi");
        
        var selectFrictionBox = new BABYLON.GUI.SelectionPanel("spi");
        selectFrictionBox.width = 0.25;
        selectFrictionBox.height = 0.25;
        selectFrictionBox.background = "#1388AF";
        selectFrictionBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        selectFrictionBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

        advancedTexture.addControl(selectFrictionBox);

        var frictionGroup = new BABYLON.GUI.SliderGroup("Friction Values", "S");
        frictionGroup.addSlider("Box", frictionBox, "units", 0, 10, 5, displayFValue);
        frictionGroup.addSlider("Ground", frictionGround, "units", 0, 10, 5, displayFValue);

        selectFrictionBox.addGroup(frictionGroup);

        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
});