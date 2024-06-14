import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const TestSheet = () => {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <div className={"flex flex-col gap-4 h-full"}>
          <div className={"flex flex-row gap-4"}>
            <div>Icon</div>
            <div>Heading</div>
          </div>
          <Separator />
          <ScrollArea className={"flex-grow relative"}>
              Galataes volare! Cum decor mori, omnes cedriumes aperto
              camerarius, teres assimilatioes. Equiso, hydra, et decor. Cum
              absolutio trabem, omnes amicitiaes talem dexter, fatalis
              calcariaes. Ubi est emeritis lura? Gratis, albus hydras interdum
              experientia de flavum, bassus adiurator. Est secundus adelphis,
              cesaris. Fortis, fatalis galluss recte prensionem de peritus,
              secundus vita. Est audax rector, cesaris. Albus, fidelis sectams
              nunquam convertam de emeritis, audax verpa. Sunt ionicis
              tormentoes examinare regius, rusticus rationees. Ortum velox
              ducunt ad dexter stella. Resistere foris ducunt ad audax caesium.
              Prarere callide ducunt ad peritus pulchritudine. Rusticus, fortis
              scutums cito perdere de teres, azureus habitio. Ubi est barbatus
              lanista? Abnobas tolerare, tanquam germanus lura. Cum vortex
              volare, omnes calcariaes dignus festus, mirabilis tuses. Vae,
              scutum! Cum rector congregabo, omnes barcases prensionem primus,
              castus lanistaes. Vox experimentums, tanquam nobilis absolutio.
              Cum tata favere, omnes tuses attrahendam noster, secundus finises.
              Messors peregrinationes! Castus, lotus fluctuss aegre reperire de
              barbatus, fidelis racana. Bi-color, nobilis cedriums cito captis
              de varius, bassus danista. Domina, absolutio, et idoleum. Palus de
              fatalis glos, desiderium buxum! Sunt fluctuies attrahendam
              grandis, neuter lanistaes. Ubi est rusticus devatio? Emeritis,
              domesticus urbss nunquam visum de fidelis, germanus cannabis.
              Magisters sunt byssuss de placidus luna. Sunt lunaes examinare
              audax, grandis deuses. Sunt fraticinidaes gratia brevis, germanus
              lixaes. Sunt racanaes imperium nobilis, lotus byssuses. Cur saga
              studere? Cum buxum persuadere, omnes eleateses resuscitabo
              azureus, raptus zeluses. Est magnum fraticinida, cesaris. Cum mens
              assimilant, omnes aonideses imperium gratis, noster fluctuses. Est
              camerarius caesium, cesaris. Salvus, rusticus demolitiones saepe
              examinare de flavum, festus fraticinida. Sunt nixes perdere
              mirabilis, regius contencioes. Exemplars sunt monss de domesticus
              historia. Omnias sunt devirginatos de rusticus tata. Cursus de
              gratis amicitia, vitare racana! Eheu. Decor azureus ausus est. Cum
              palus congregabo, omnes plasmatores dignus peritus, ferox
              pulchritudinees. Peregrinationes virtualiter ducunt ad peritus
              historia. Camerarius turpis nunquam locuss stella est. Resistere
              foris ducunt ad bassus liberi. Fluctuis sunt advenas de varius
              fermium.
          </ScrollArea>
          <div
            className={
              "flex flex-row justify-around sticky bottom-0 h-12 items-center"
            }
          >
            <Button>Yes</Button>
            <Button>No</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TestSheet;
