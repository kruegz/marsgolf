window.addEventListener('DOMContentLoaded', function(){
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Purple();

        // var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 50, BABYLON.Vector3.Zero(), scene);
        // var camera = new BABYLON.FollowCamera("camera", BABYLON.Vector3(10, 10, 10), scene);

        // This creates and initially positions a follow camera     
        var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, 10), scene);
        
        //The goal distance of camera from target
        camera.radius = 30;
        
        // The goal height of camera above local origin (centre) of target
        camera.heightOffset = 5;
        
        // The goal rotation of camera around local origin (centre) of target in x y plane
        camera.rotationOffset = 0;
        
        //Acceleration of camera in moving from current to goal position
        camera.cameraAcceleration = 0.005
        
        //The speed at which acceleration is halted 
        camera.maxCameraSpeed = 10
        camera.attachControl(canvas, true);

        var light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0.2, -1, 0), scene);
        light.position = new BABYLON.Vector3(0, 80, 0);

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

        // Box
        // var ball = BABYLON.MeshBuilder.CreateBox("Box", {size:4}, scene);
        var ball = BABYLON.Mesh.CreateSphere('sphere1', 16, 1, scene);
        ball.position = new BABYLON.Vector3(-2, 4, 0);
        // var materialWood = new BABYLON.StandardMaterial("wood", scene);
        // materialWood.diffuseTexture = new BABYLON.Texture("textures/crate.png", scene);
        // materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        // ball.material = materialWood;

        camera.lockedTarget = ball; // target any mesh or object with a "position" Vector3
        console.log(camera.lockedTarget)
        scene.activeCamera = camera;

        shadowGenerator.addShadowCaster(ball);


        // Ground (using a ball not a plane)
        var ground = BABYLON.MeshBuilder.CreateBox("Ground", {width: 1000, height: 1, depth: 1000}, scene);
        ground.position.y = -5.0;

        var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        groundMat.backFaceCulling = false;
        // groundMat.diffuseTexture = new BABYLON.Texture("https://www.astrobio.net/wp-content/uploads/2018/09/Mars_Express_view_of_Cerberus_Fossae_highlight_mob.jpg", scene);
        // groundMat.specularTexture = new BABYLON.Texture("https://www.astrobio.net/wp-content/uploads/2018/09/Mars_Express_view_of_Cerberus_Fossae_highlight_mob.jpg", scene);
        // groundMat.emissiveTexture = new BABYLON.Texture("https://www.astrobio.net/wp-content/uploads/2018/09/Mars_Express_view_of_Cerberus_Fossae_highlight_mob.jpg", scene);
        // groundMat.ambientTexture = new BABYLON.Texture("https://www.astrobio.net/wp-content/uploads/2018/09/Mars_Express_view_of_Cerberus_Fossae_highlight_mob.jpg", scene);
        // groundMat.diffuseColor = new BABYLON.Color3(1, 0, 1);
        // groundMat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        // groundMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // groundMat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

        ground.material = groundMat;
        ground.receiveShadows = true;

        // Physics
        scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
        //scene.enablePhysics(null, new BABYLON.OimoJSPlugin());
        //scene.enablePhysics(null, new BABYLON.AmmoJSPlugin());

        // Add Imposters
        ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, friction: 0.0, restitution: 0.3 }, scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0.7 }, scene);
       
        //Impulse Settings
        var impulseDirection = new BABYLON.Vector3(0, 1, 0);
        var impulseMagnitude = 5;
        var contactLocalRefPoint = BABYLON.Vector3.Zero();

        var Pulse = function() {
            ball.physicsImpostor.applyImpulse(impulseDirection.scale(impulseMagnitude), ball.getAbsolutePosition().add(contactLocalRefPoint));
        }
        
        //GUI
        
        var changeX = function(value) {
            impulseDirection.x = value;
        }

        var changeY = function(value) {
            impulseDirection.y = value;
        }
        
        var changeZ = function(value) {
            impulseDirection.z = value;
        }

        var magnitude = function(value) {
            impulseMagnitude = value;
        }

        var contactX = function(value) {
            contactLocalRefPoint.x = value;
        }

        var contactY = function(value) {
            contactLocalRefPoint.y = value;
        }

        var frictionBox = function(value) {
            ball.physicsImpostor.friction = value;
        }

        var frictionGround = function(value) {
            ground.physicsImpostor.friction = value;
        }

        var contactZ = function(value) {
            contactLocalRefPoint.z = value;
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

        var impulseMGroup = new BABYLON.GUI.SliderGroup("Impulse Magnitude", "S");
        impulseMGroup.addSlider("Value", magnitude, "units", 0, 100, 5, displayMValue);
        
        var impulseDGroup = new BABYLON.GUI.SliderGroup("Impulse Direction", "S");
        impulseDGroup.addSlider("X", changeX, "units", -1, 1, 0, displayDValue);
        impulseDGroup.addSlider("Y", changeY, "units", -1, 1, 1, displayDValue);
        impulseDGroup.addSlider("Z", changeZ, "units", -1, 1, 0, displayDValue);

        var contactGroup = new BABYLON.GUI.SliderGroup("Contact Position", "S");
        contactGroup.addSlider("X", contactX, "units", -2, 2, 0, displayDValue);
        contactGroup.addSlider("Y", contactY, "units", -2, 2, 0, displayDValue);
        contactGroup.addSlider("Z", contactZ, "units", -2, 2, 0, displayDValue); 

        selectBox.addGroup(impulseMGroup);
        selectBox.addGroup(impulseDGroup);
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
        frictionGroup.addSlider("Box", frictionBox, "units", 0, 10, 0, displayFValue);
        frictionGroup.addSlider("Ground", frictionGround, "units", 0, 10, 0, displayFValue);

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