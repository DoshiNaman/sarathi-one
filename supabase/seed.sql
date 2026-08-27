-- Synthetic demo fleet. Safe to re-run (upserts).
-- Generated from src/lib/data.ts — no real vehicles, owners or people.

insert into public.vehicles (reg_no,maker,model,year,vehicle_class,fuel,emission,color,rto,reg_date,chassis_masked,engine_masked,status,hypo_active,hypo_financier,hypo_since,hypo_form35_pending,insurer,insurance_till,puc_till,tax_till,fitness_till,accident_flag,accident_note,fair_price_min,fair_price_max,odometer_km) values
('GJ01AB1234','Maruti Suzuki','Swift VXI',2021,'Motor Car (LMV)','PETROL','BS6','Pearl White','GJ01 - Ahmedabad','2021-03-15','MA3EYD32S00XXXXXX','K12MNXXXXXX','ACTIVE',true,'HDFC Bank Ltd','2023-08-02',true,'ICICI Lombard','2027-02-11','2026-11-20','2036-03-14',null,false,null,465000,510000,48200),
('GJ05CD5678','Hyundai','i20 Sportz',2022,'Motor Car (LMV)','PETROL','BS6','Fiery Red','GJ05 - Surat','2022-06-10','MALBB51BLHMXXXXXX','G4LAXXXXXX','ACTIVE',false,null,null,false,'Bajaj Allianz','2027-06-09','2027-01-05','2037-06-09',null,false,null,610000,655000,31500),
('GJ06EF9012','Honda','City ZX',2019,'Motor Car (LMV)','PETROL','BS4','Golden Brown','GJ06 - Vadodara','2019-01-22','MRHGM6650KPXXXXXX','L15B1XXXXXX','ACTIVE',false,null,null,false,'New India Assurance','2026-09-01','2026-07-30','2034-01-21',null,true,'Major damage claim recorded (insurer, 2023). Structural repair indicated.',520000,585000,88700),
('GJ18GH3456','Tata','Nexon XZ+',2020,'Motor Car (LMV)','DIESEL','BS6','Foliage Green','GJ18 - Gandhinagar','2020-09-05','MAT62744XLPXXXXXX','1497TCXXXXXX','BLACKLISTED',false,null,null,false,'Oriental Insurance','2025-11-30','2025-10-11','2030-09-04',null,false,null,0,0,61000),
('GJ03JK7890','Maruti Suzuki','WagonR LXI',2017,'Motor Car (LMV)','CNG','BS4','Silky Silver','GJ03 - Rajkot','2017-04-18','MA3EWDE1S00XXXXXX','K10BNXXXXXX','ACTIVE',false,null,null,false,'United India','2026-04-02','2026-06-15','2032-04-17',null,false,null,210000,245000,74300),
('GJ12MN2468','Mahindra','Bolero Pik-Up',2021,'Goods Carrier (LGV)','DIESEL','BS6','White','GJ12 - Jamnagar','2021-11-25','MA1ZS2GHKM2XXXXXX','GHB4XXXXXX','ACTIVE',true,'Cholamandalam Finance','2021-11-25',false,'IFFCO Tokio','2026-11-24','2026-10-02','2026-09-30','2026-11-24',false,null,640000,700000,112000),
('GJ27PQ1357','Kia','Sonet HTK+',2022,'Motor Car (LMV)','PETROL','BS6','Aurora Black','GJ27 - Ahmedabad East','2022-02-14','MZBFP81CLNMXXXXXX','G4FLXXXXXX','ACTIVE',false,null,null,false,'HDFC Ergo','2027-02-13','2026-12-25','2037-02-13',null,false,null,780000,840000,27800),
('GJ04RS8642','Hyundai','Santro Xing',2008,'Motor Car (LMV)','PETROL','BS3','Beige','GJ04 - Bhavnagar','2008-08-30','MALAA51HR8MXXXXXX','G4HGXXXXXX','SCRAPPED',false,null,null,false,'—','2024-08-29','2024-06-01','2023-08-29',null,false,null,0,0,158000)
on conflict (reg_no) do update set maker=excluded.maker, model=excluded.model, year=excluded.year, status=excluded.status, hypo_active=excluded.hypo_active, hypo_financier=excluded.hypo_financier, hypo_form35_pending=excluded.hypo_form35_pending, accident_flag=excluded.accident_flag, accident_note=excluded.accident_note, fair_price_min=excluded.fair_price_min, fair_price_max=excluded.fair_price_max, odometer_km=excluded.odometer_km;

insert into public.owners (reg_no,serial,name,masked_name,from_date,to_date) values
('GJ01AB1234',1,'Rajesh Patel','RA****H P***L','2021-03-15','2023-08-02'),
('GJ01AB1234',2,'Amit Shah','AM** S**H','2023-08-02',null),
('GJ05CD5678',1,'Priya Desai','PR*** D***I','2022-06-10',null),
('GJ06EF9012',1,'Suresh Mehta','SU****H M***A','2019-01-22','2021-05-30'),
('GJ06EF9012',2,'Kiran Joshi','KI**N J***I','2021-05-30','2024-02-14'),
('GJ06EF9012',3,'Vikram Chauhan','VI***M C*****N','2024-02-14',null),
('GJ18GH3456',1,'Deepak Rana','DE***K R**A','2020-09-05',null),
('GJ03JK7890',1,'Naman Doshi','NA*** D***I','2017-04-18',null),
('GJ12MN2468',1,'Bharat Transport Co','BH***T T******T CO','2021-11-25',null),
('GJ27PQ1357',1,'Meera Iyer','ME*** I**R','2022-02-14',null),
('GJ04RS8642',1,'Hasmukh Trivedi','HA****H T*****I','2008-08-30','2025-12-01')
on conflict (reg_no,serial) do update set name=excluded.name, masked_name=excluded.masked_name, from_date=excluded.from_date, to_date=excluded.to_date;

insert into public.challans (id,reg_no,date,offense,amount,status) values
('CH-88121','GJ01AB1234','2025-12-04','Over-speeding (MV Act 183)',1500,'PAID'),
('CH-91245','GJ01AB1234','2026-05-18','No parking zone',500,'PENDING'),
('CH-45332','GJ06EF9012','2024-11-02','Signal jump (MV Act 184)',5000,'PENDING'),
('CH-45890','GJ06EF9012','2025-01-15','Driving without seatbelt',1000,'PENDING'),
('CH-51002','GJ06EF9012','2025-09-21','Over-speeding (MV Act 183)',2000,'PENDING'),
('CH-99011','GJ18GH3456','2025-06-19','Vehicle reported in theft case',0,'DISPUTED'),
('CH-77120','GJ03JK7890','2026-07-01','Expired PUC (MV Act 190(2))',1000,'PENDING'),
('CH-33451','GJ12MN2468','2026-02-11','Overloading (MV Act 194)',20000,'PAID')
on conflict (id) do update set status=excluded.status, amount=excluded.amount;
