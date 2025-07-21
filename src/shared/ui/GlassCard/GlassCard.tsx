type GlassCardProps = {
  children: React.ReactNode;
}


export const GlassCard = ({ children}: GlassCardProps) => (
  
   <div  className="rounded-md px-4 py-3 mb-3 flex flex-col gap-2"
  style={{
    background: 'rgba(229,229,216,0.4)',
    backdropFilter: 'blur(4px)',
  }}>
     {children}
  </div>
);
