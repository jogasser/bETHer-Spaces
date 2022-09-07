use strict;
use warnings;
my @files = glob("*.xml");

foreach my $file (@files) {
	print $file, "\n";
	open(IN, $file);
	while(my $in = <IN>) {
		if($in =~ /<coordinates>(.*?)<\/coordinates>/){
			my $coords = $1;
			my @points = split(' ', $coords);
			pop(@points);

			my $polygon = "";

			for my $point ( @points) {
				my @cords = split(',', $point);
				if(defined($cords[0]) && defined($cords[1])) {
					$polygon .= "                       {\"lon\": $cords[0], \"lat\": $cords[1]},\n";
				} else {
					print "Unknown value: ", $point, "\n";
				}
			}
			chomp($polygon);
			chop($polygon);

			print $polygon, "\n";
		}
	}

	close(IN);
}
