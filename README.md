# line_of_credit

I think there is a mistake in the examples given.

In Scenario 1, someone draws money on day 1 and is charged 30 days of interest.  This means the day he borrows money is included in the interest calculation.

In Scenario 2, if we hold this to be true, the $100 drawn on day 25 should result in 6 days of interest, not 5 (days 25-30).

To compensate for this in my code, I assume that the day money is drawn/paid is the day the new balance is applied to.
Thus, for Scenario 2, the $500 drawn on day 1, with $200 paid back on day 15 results in $500 worth of interest for 14 days (days 1-14).  Day 15 is the first day the balance is $300.

The other possibility to this is that payments do not get applied to the account until the following day.  This is not how I implemented it.
