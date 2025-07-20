import LogoShort from "./LogoShort";

const Logo = () => {
  return (
    <div className="flex items-stretch bg-background rounded-lg overflow-hidden border-2 border-primary/80">
      <LogoShort />
      <div className="bg-gradient-to-r from-background via-primary/80 to-primary flex items-center justify-center">
        <p className="font-semibold tracking-[0.25rem] text-base px-2 text-background">
          <span className="text-primary">PR</span>Genie
        </p>
      </div>
    </div>
  );
};
export default Logo;
