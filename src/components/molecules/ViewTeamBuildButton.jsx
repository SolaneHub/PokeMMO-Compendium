import Button from"@/components/atoms/Button"; function ViewTeamBuildButton({ selectedTeam, onOpen }) { return ( <div className="flex animate-[fade-in_0.3s_ease-out] justify-center"> <Button onClick={onOpen} variant="primary"> 📋 View {selectedTeam} Team Build </Button> </div> );
} export default ViewTeamBuildButton; 
