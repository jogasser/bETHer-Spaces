use strict;
use warnings;
use Data::Dumper;

my @files = glob("*.xml");

my $h = {};

foreach my $file (@files) {
	open(IN, $file);
	my $in = join('', <IN>);
	close(IN);

	my $room = $file;
	$room =~ s/\.xml//;
	while($in =~ s/<coordinates>(.*?)<\/coordinates>//) {		
		my $coords = $1;
		if(!defined $h->{$coords}->{rooms}) {
			$h->{$coords}->{rooms} = [];
		}

		push @{$h->{$coords}->{rooms}}, $room;

		if(!defined $h->{$coords}->{points}) {
			my @points = split(' ', $coords);
			pop(@points);

			my $polygon = "\n";

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
			$h->{$coords}->{points} = $polygon;
		}
	}
}

my $progress;
my $needsFixing;
do {
	$progress = 0;
	$needsFixing = 0;
	foreach my $key(keys %$h) {
		if(scalar @{$h->{$key}->{rooms}} == 1) {
			my $room = @{$h->{$key}->{rooms}}[0];
			foreach my $otherKey(keys %$h){
				next if $otherKey eq $key;
				my $length = scalar @{$h->{$otherKey}->{rooms}};
				$length--;
				#print "Array Length: ", $length, "\n";
				my ($index) = grep { @{$h->{$otherKey}->{rooms}}[$_] eq $room } 0..$length; 
				if (defined($index)) {
					splice(@{$h->{$otherKey}->{rooms}}, $index, 1);  
					$progress = 1;
				}
			}
		} else {
			$needsFixing = 1;
		}
	}
} while ($needsFixing == 1);

if($progress == 0) {
	print "Failed to make further progress\n";
}

foreach my $key (keys %$h) {
	print @{$h->{$key}->{rooms}}[0], $h->{$key}->{points}, "\n\n";
}
