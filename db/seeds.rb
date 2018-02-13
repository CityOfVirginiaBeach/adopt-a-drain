require 'csv'
require 'open-uri'



# url = '/Users/jmhall/Downloads/CVB-Drains.csv'
# url = 'http://data.openoakland.org/storage/f/2012-11-01T014902/Inlets.csv'
# url = 'https://www.vbgov.com/_assets/_apis/CVB-Drains.csv'
url = 'https://media.vbgov.com/rea/adopta/CVB-drains.csv'

# puts 'removing old things data'
# Thing.destroy_all
create_thing = 0
update_thing = 0          
failed_update = 0
nil_thing = 0
puts 'connecting'
open(url) do |f|
  puts 'downloading'
  f.each_line do |l|
    CSV.parse(l) do |row|
      
      if(row[4] == "OBJECTID")
        next
      else
        city_id = row[3].to_i
        lat = row[2].to_f
        lng = row[1].to_f
        puts "#{row} "        

        if city_id > 1        
          
          
          
          drain = Thing.find_by_city_id( city_id )
          
          puts "#{city_id} #{lng} #{lat}"
          
          if drain
            puts "UPDATING #{city_id} #{lng} #{lat} "                    
            update_thing = update_thing + 1            
          else
            puts "CREATING NEW #{city_id} #{lng} #{lat} "        
            drain = Thing.new({:city_id => city_id, :lng => lng, :lat => lat})          
            create_thing = create_thing + 1            
          end
          

          updated_successul = false
          if !lng.nil? && !lat.nil?
            drain.update_attributes({:lng => lng, :lat => lat})          
            updated_successul = drain.save!            
          else
            nil_thing = nil_thing + 1            
            
          end
          
          
          
          if updated_successul
            puts "SAVED"                                             
          else
            puts "FAILED"
            failed_update = failed_update + 1                        
          end


        end
      end
    end
  end 
end