module FL{
   
    export class AnimationLoader{

         /**不需要解释吧？ */
        public static loadAnimation(skeDataRes:string,texDataRes:string, texRes:string, armName:string="armatureName"):any{
            let skeletonData = RES.getRes(skeDataRes);
            let textureData = RES.getRes(texDataRes);
            let texture = RES.getRes(texRes);
            let factory = new dragonBones.EgretFactory();
            factory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            factory.addTextureAtlasData(factory.parseTextureAtlasData(textureData, texture));

            let armature:dragonBones.Armature = factory.buildArmature(armName);
            // var armatureDisplay = armature.getDisplay();
            dragonBones.WorldClock.clock.add(armature);
            armature.animation.play(null,1);
            return armature;
        }
    }
    
}